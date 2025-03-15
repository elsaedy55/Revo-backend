import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// دالة لتنفيذ ملفات الترحيل
async function runMigrations() {
    const client = await pool.connect();
    
    try {
        // إنشاء جدول لتتبع الترحيلات المنفذة
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // قراءة وتنفيذ ملفات الترحيل
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        for (const file of files) {
            const migrationName = path.basename(file, '.sql');
            
            // التحقق مما إذا تم تنفيذ الترحيل مسبقًا
            const { rows } = await client.query(
                'SELECT * FROM migrations WHERE name = $1',
                [migrationName]
            );

            if (rows.length === 0) {
                // قراءة وتنفيذ ملف الترحيل
                const sql = fs.readFileSync(
                    path.join(migrationsDir, file),
                    'utf-8'
                );
                
                await client.query('BEGIN');
                try {
                    await client.query(sql);
                    await client.query(
                        'INSERT INTO migrations (name) VALUES ($1)',
                        [migrationName]
                    );
                    await client.query('COMMIT');
                    console.log(`✅ تم تنفيذ الترحيل: ${migrationName}`);
                } catch (error) {
                    await client.query('ROLLBACK');
                    console.error(`❌ خطأ في تنفيذ الترحيل ${migrationName}:`, error);
                    throw error;
                }
            } else {
                console.log(`⏭️ تم تخطي الترحيل ${migrationName} (تم تنفيذه مسبقًا)`);
            }
        }
        
        console.log('✨ تم تنفيذ جميع الترحيلات بنجاح');
    } catch (error) {
        console.error('❌ حدث خطأ أثناء تنفيذ الترحيلات:', error);
        throw error;
    } finally {
        client.release();
    }
}

// تنفيذ الترحيلات
runMigrations().catch(console.error);