// Quick test script to verify Supabase database connection
// Run with: node test-db-connection.js

require("dotenv").config();
const { Sequelize } = require("sequelize");

async function testConnection() {
  console.log("🔍 Testing Supabase database connection...\n");

  // Check if connection string exists
  if (!process.env.POSTGRESQL_CONNECTION_STRING) {
    console.error(
      "❌ Error: POSTGRESQL_CONNECTION_STRING not found in .env file",
    );
    console.log(
      "\n💡 Make sure you have created .env file with your Supabase connection string",
    );
    process.exit(1);
  }

  console.log("✅ Connection string found in environment");
  console.log("🔗 Connecting to database...\n");

  const sequelize = new Sequelize(process.env.POSTGRESQL_CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });

  try {
    // Test authentication
    await sequelize.authenticate();
    console.log("✅ Connection established successfully!\n");

    // Test if books table exists
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'books'
      );
    `);

    const tableExists = results[0].exists;

    if (tableExists) {
      console.log("✅ Books table exists\n");

      // Get table structure
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'books'
        ORDER BY ordinal_position;
      `);

      console.log("📋 Table structure:");
      console.table(columns);

      // Get row count
      const [count] = await sequelize.query(
        "SELECT COUNT(*) as count FROM books",
      );
      console.log(`\n📊 Total books in database: ${count[0].count}\n`);

      // Show sample data if any
      if (count[0].count > 0) {
        const [books] = await sequelize.query(
          "SELECT id, title, author, created_at FROM books LIMIT 3",
        );
        console.log("📚 Sample books:");
        console.table(books);
      }
    } else {
      console.log("⚠️  Books table does NOT exist");
      console.log("\n💡 Run the SQL script in Supabase SQL Editor:");
      console.log("   File: backend/supabase-schema.sql\n");
    }

    await sequelize.close();
    console.log("✅ All tests passed! Database is ready to use.\n");
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("   1. Check that your connection string is correct in .env");
    console.log(
      "   2. Make sure you replaced [YOUR-PASSWORD] with actual password",
    );
    console.log("   3. Verify your Supabase project is running");
    console.log(
      '   4. Check that "Use connection pooling" is enabled in Supabase\n',
    );
    process.exit(1);
  }
}

testConnection();
