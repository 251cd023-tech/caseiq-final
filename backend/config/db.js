const { Pool, Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'caseiq',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000
};

const pool = new Pool(dbConfig);

// Helper query function
const query = (text, params) => pool.query(text, params);

// Auto-create database and tables on startup
async function initDatabase() {
  console.log('🐘 Initializing PostgreSQL database connection...');

  // Step 1: Ensure 'caseiq' database exists by checking against default 'postgres' database
  try {
    const adminClient = new Client({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: 'postgres'
    });

    await adminClient.connect();
    const checkDbRes = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbConfig.database]
    );

    if (checkDbRes.rowCount === 0) {
      console.log(`🔨 Database '${dbConfig.database}' not found. Creating database...`);
      await adminClient.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.log(`✅ Database '${dbConfig.database}' created successfully!`);
    } else {
      console.log(`✅ Database '${dbConfig.database}' already exists.`);
    }

    await adminClient.end();
  } catch (err) {
    console.warn(`⚠️  Admin database check notice: ${err.message}. Proceeding to connect to '${dbConfig.database}'...`);
  }

  // Step 2: Connect to caseiq and create all tables
  try {
    const client = await pool.connect();
    console.log(`🔌 Connected to PostgreSQL database '${dbConfig.database}'!`);

    await client.query(`
      -- 1. Users table
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        numeric_id SERIAL,
        name VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'Lawyer',
        organization VARCHAR(255),
        avatar TEXT,
        bookmarks JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 2. Acts table
      CREATE TABLE IF NOT EXISTS acts (
        id VARCHAR(100) PRIMARY KEY,
        numeric_id SERIAL,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(255),
        year INT,
        status VARCHAR(100),
        replaced_by VARCHAR(255),
        total_sections INT,
        chapters_count INT,
        enactment_date VARCHAR(100),
        jurisdiction VARCHAR(255),
        category VARCHAR(100),
        description TEXT,
        source VARCHAR(255),
        source_url TEXT,
        verified BOOLEAN DEFAULT TRUE
      );

      -- 3. Sections table
      CREATE TABLE IF NOT EXISTS sections (
        id VARCHAR(100) PRIMARY KEY,
        numeric_id SERIAL,
        act_id VARCHAR(100) REFERENCES acts(id) ON DELETE CASCADE,
        act_code VARCHAR(50) NOT NULL,
        section_number VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        chapter VARCHAR(255),
        content TEXT,
        explanation TEXT,
        punishment TEXT,
        bailable VARCHAR(100),
        cognizable VARCHAR(100),
        compoundable VARCHAR(100),
        triable_by VARCHAR(255),
        key_points JSONB DEFAULT '[]'::jsonb,
        relevance_tags JSONB DEFAULT '[]'::jsonb,
        predecessor_section VARCHAR(255),
        source VARCHAR(255),
        source_url TEXT,
        verified BOOLEAN DEFAULT TRUE
      );

      -- 4. Cases table
      CREATE TABLE IF NOT EXISTS cases (
        id VARCHAR(100) PRIMARY KEY,
        numeric_id SERIAL,
        name VARCHAR(255) NOT NULL,
        case_name VARCHAR(255) NOT NULL,
        citation VARCHAR(255),
        court VARCHAR(255) NOT NULL,
        bench VARCHAR(500),
        judgment_date VARCHAR(100),
        year INT,
        legal_topics JSONB DEFAULT '[]'::jsonb,
        analysis JSONB NOT NULL,
        summary TEXT,
        important_facts TEXT,
        key_legal_principles TEXT,
        issues TEXT,
        arguments TEXT,
        decision TEXT,
        reasoning TEXT,
        judgment_text TEXT,
        relevance_analysis TEXT,
        source VARCHAR(255),
        source_url TEXT,
        verified BOOLEAN DEFAULT TRUE
      );

      -- 5. Precedents relationship table
      CREATE TABLE IF NOT EXISTS precedents (
        id VARCHAR(100) PRIMARY KEY,
        numeric_id SERIAL,
        source_case_id VARCHAR(100),
        source_case_name VARCHAR(255),
        target_case_id VARCHAR(100),
        target_case_name VARCHAR(255),
        relationship_type VARCHAR(50) NOT NULL, -- Followed | Referred | Distinguished | Overruled
        notes TEXT,
        citation VARCHAR(255),
        verified BOOLEAN DEFAULT TRUE
      );

      -- 6. Law Mappings (Old Law -> New Law)
      CREATE TABLE IF NOT EXISTS law_mappings (
        id VARCHAR(100) PRIMARY KEY,
        numeric_id SERIAL,
        category VARCHAR(100),
        old_act VARCHAR(255),
        old_section VARCHAR(100),
        old_title VARCHAR(255),
        old_provision TEXT,
        new_act VARCHAR(255),
        new_section VARCHAR(100),
        new_title VARCHAR(255),
        new_provision TEXT,
        punishment_change TEXT,
        important_differences JSONB DEFAULT '[]'::jsonb,
        notes TEXT,
        relevance_tags JSONB DEFAULT '[]'::jsonb,
        source VARCHAR(255),
        verified BOOLEAN DEFAULT TRUE,
        related_precedent_ids JSONB DEFAULT '[]'::jsonb
      );

      -- 7. Saved Cases table
      CREATE TABLE IF NOT EXISTS saved_cases (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        case_id VARCHAR(100) NOT NULL,
        case_data JSONB,
        saved_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, case_id)
      );

      -- 8. Search History table
      CREATE TABLE IF NOT EXISTS search_history (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        query TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'all',
        results_count INT DEFAULT 0,
        top_match TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 9. Community Posts & Comments
      CREATE TABLE IF NOT EXISTS community_posts (
        id VARCHAR(100) PRIMARY KEY,
        author_id VARCHAR(100) NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_role VARCHAR(100),
        author_org VARCHAR(255),
        author_avatar TEXT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100),
        tags JSONB DEFAULT '[]'::jsonb,
        upvotes INT DEFAULT 1,
        upvoted_by JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        comments JSONB DEFAULT '[]'::jsonb
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_cases_name ON cases(name);
      CREATE INDEX IF NOT EXISTS idx_sections_act ON sections(act_id, act_code);
      CREATE INDEX IF NOT EXISTS idx_saved_cases_user ON saved_cases(user_id);
      CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);
    `);

    console.log('✅ PostgreSQL schema & indexes verified/created successfully!');

    // Step 3: Auto-seed data if tables are empty
    await autoSeedDatabase(client);

    client.release();
    return true;
  } catch (err) {
    console.error('❌ PostgreSQL initialization error:', err.message);
    return false;
  }
}

// Auto-seed initial knowledge base if empty
async function autoSeedDatabase(client) {
  try {
    const { users, acts, sections, cases, precedentRelationships, lawMappings, communityPosts } = require('../data/seedData');

    // 1. Seed Users
    const userCount = await client.query('SELECT count(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding users into PostgreSQL...');
      for (const u of users) {
        await client.query(
          `INSERT INTO users (id, name, full_name, email, password, role, organization, avatar, bookmarks, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (email) DO NOTHING`,
          [u.id, u.name, u.name, u.email, u.password, u.role, u.organization, u.avatar, JSON.stringify(u.bookmarks || []), u.createdAt || new Date()]
        );
      }
    }

    // 2. Seed Acts
    const actCount = await client.query('SELECT count(*) FROM acts');
    if (parseInt(actCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding acts into PostgreSQL...');
      for (const a of acts) {
        await client.query(
          `INSERT INTO acts (id, code, name, short_name, year, status, replaced_by, total_sections, chapters_count, enactment_date, jurisdiction, category, description, source, source_url, verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO NOTHING`,
          [a.id, a.code, a.name, a.shortName, a.year, a.status, a.replacedBy, a.totalSections, a.chaptersCount, a.enactmentDate, a.jurisdiction, a.category, a.description, a.source, a.sourceUrl, a.verified]
        );
      }
    }

    // 3. Seed Sections
    const sectionCount = await client.query('SELECT count(*) FROM sections');
    if (parseInt(sectionCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding statutory sections into PostgreSQL...');
      for (const s of sections) {
        await client.query(
          `INSERT INTO sections (id, act_id, act_code, section_number, title, chapter, content, explanation, punishment, bailable, cognizable, compoundable, triable_by, key_points, relevance_tags, predecessor_section, source, source_url, verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
           ON CONFLICT (id) DO NOTHING`,
          [s.id, s.actId, s.actCode, s.sectionNumber, s.title, s.chapter, s.content, s.explanation, s.punishment, s.bailable, s.cognizable, s.compoundable, s.triableBy, JSON.stringify(s.keyPoints || []), JSON.stringify(s.relevanceTags || []), s.predecessorSection, s.source, s.sourceUrl, s.verified]
        );
      }
    }

    // 4. Seed Cases
    const caseCount = await client.query('SELECT count(*) FROM cases');
    if (parseInt(caseCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding landmark cases into PostgreSQL...');
      for (const c of cases) {
        const analysis = c.analysis || {};
        await client.query(
          `INSERT INTO cases (id, name, case_name, citation, court, bench, judgment_date, year, legal_topics, analysis, summary, important_facts, key_legal_principles, issues, arguments, decision, reasoning, judgment_text, relevance_analysis, source, source_url, verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
           ON CONFLICT (id) DO NOTHING`,
          [
            c.id,
            c.caseName || c.name,
            c.caseName || c.name,
            c.citation,
            c.court,
            c.bench,
            c.judgmentDate,
            c.year || 2020,
            JSON.stringify(c.legalTopics || []),
            JSON.stringify(analysis),
            analysis.decision || c.summary || '',
            analysis.facts || c.importantFacts || '',
            analysis.reasoning || c.keyLegalPrinciples || '',
            analysis.issues || c.issues || '',
            typeof analysis.arguments === 'object' ? JSON.stringify(analysis.arguments) : (analysis.arguments || ''),
            analysis.decision || c.decision || '',
            analysis.reasoning || c.reasoning || '',
            c.judgmentText || `Judgment Text for ${c.caseName}`,
            c.relevanceAnalysis || null,
            c.source,
            c.sourceUrl,
            c.verified
          ]
        );
      }
    }

    // 5. Seed Precedents
    const precCount = await client.query('SELECT count(*) FROM precedents');
    if (parseInt(precCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding precedent relationships into PostgreSQL...');
      for (const p of precedentRelationships) {
        await client.query(
          `INSERT INTO precedents (id, source_case_id, source_case_name, target_case_id, target_case_name, relationship_type, notes, citation, verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [p.id, p.sourceCaseId, p.sourceCaseName, p.targetCaseId, p.targetCaseName, p.relationshipType, p.notes, p.citation, p.verified]
        );
      }
    }

    // 6. Seed Law Mappings
    const mapCount = await client.query('SELECT count(*) FROM law_mappings');
    if (parseInt(mapCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding law mappings into PostgreSQL...');
      for (const m of lawMappings) {
        await client.query(
          `INSERT INTO law_mappings (id, category, old_act, old_section, old_title, old_provision, new_act, new_section, new_title, new_provision, punishment_change, important_differences, notes, relevance_tags, source, verified, related_precedent_ids)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
           ON CONFLICT (id) DO NOTHING`,
          [m.id, m.category, m.oldAct, m.oldSection, m.oldTitle, m.oldProvision, m.newAct, m.newSection, m.newTitle, m.newProvision, m.punishmentChange, JSON.stringify(m.importantDifferences || []), m.notes, JSON.stringify(m.relevanceTags || []), m.source, m.verified, JSON.stringify(m.relatedPrecedentIds || [])]
        );
      }
    }

    // 7. Seed Community Posts
    const postCount = await client.query('SELECT count(*) FROM community_posts');
    if (parseInt(postCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding community discussions into PostgreSQL...');
      for (const cp of communityPosts) {
        await client.query(
          `INSERT INTO community_posts (id, author_id, author_name, author_role, author_org, author_avatar, title, content, category, tags, upvotes, upvoted_by, created_at, comments)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO NOTHING`,
          [cp.id, cp.authorId, cp.authorName, cp.authorRole, cp.authorOrg, cp.authorAvatar, cp.title, cp.content, cp.category, JSON.stringify(cp.tags || []), cp.upvotes || 1, JSON.stringify(cp.upvotedBy || []), cp.createdAt || new Date(), JSON.stringify(cp.comments || [])]
        );
      }
    }

    console.log('🎉 PostgreSQL database seeding completed!');
  } catch (err) {
    console.warn('⚠️  Auto-seed warning:', err.message);
  }
}

module.exports = {
  pool,
  query,
  initDatabase
};
