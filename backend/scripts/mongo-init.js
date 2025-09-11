// MongoDB initialization script for production
// This script will run when the MongoDB container starts

print('🍃 Initializing Training Employment Database...');

// Switch to the application database
db = db.getSiblingDB('training_employment');

// Create application user
db.createUser({
  user: 'app_user',
  pwd: 'secure_app_password_change_me',
  roles: [
    {
      role: 'readWrite',
      db: 'training_employment'
    }
  ]
});

// Create collections with validation
print('📄 Creating collections...');

// Users collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password_hash', 'name', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        password_hash: { bsonType: 'string' },
        name: { bsonType: 'string' },
        role: { 
          bsonType: 'string',
          enum: ['admin', 'user', 'employer']
        },
        is_active: { bsonType: 'bool' },
        created_at: { bsonType: 'date' }
      }
    }
  }
});

// Jobs collection
db.createCollection('jobs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'company', 'location', 'job_type'],
      properties: {
        title: { bsonType: 'string' },
        company: { bsonType: 'string' },
        location: { bsonType: 'string' },
        job_type: { bsonType: 'string' },
        salary_min: { bsonType: 'number' },
        salary_max: { bsonType: 'number' },
        is_active: { bsonType: 'bool' },
        created_at: { bsonType: 'date' }
      }
    }
  }
});

// Resumes collection
db.createCollection('resumes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'full_name', 'email'],
      properties: {
        user_id: { bsonType: 'objectId' },
        full_name: { bsonType: 'string' },
        email: { 
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        phone: { bsonType: 'string' },
        created_at: { bsonType: 'date' },
        updated_at: { bsonType: 'date' }
      }
    }
  }
});

// Create indexes for better performance
print('🔍 Creating indexes...');

// Users indexes
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'role': 1 });
db.users.createIndex({ 'is_active': 1 });
db.users.createIndex({ 'created_at': -1 });

// Jobs indexes
db.jobs.createIndex({ 'title': 'text', 'company': 'text', 'description': 'text' });
db.jobs.createIndex({ 'location': 1 });
db.jobs.createIndex({ 'job_type': 1 });
db.jobs.createIndex({ 'is_active': 1 });
db.jobs.createIndex({ 'created_at': -1 });
db.jobs.createIndex({ 'salary_min': 1, 'salary_max': 1 });

// Resumes indexes
db.resumes.createIndex({ 'user_id': 1 });
db.resumes.createIndex({ 'email': 1 });
db.resumes.createIndex({ 'full_name': 'text' });
db.resumes.createIndex({ 'created_at': -1 });
db.resumes.createIndex({ 'updated_at': -1 });

// Applications indexes (if you have this collection)
db.applications.createIndex({ 'job_id': 1 });
db.applications.createIndex({ 'user_id': 1 });
db.applications.createIndex({ 'status': 1 });
db.applications.createIndex({ 'created_at': -1 });

print('✅ Database initialization complete!');
print('📊 Collections created: ' + db.getCollectionNames().length);
print('🔍 Indexes created successfully');

// Insert default admin user (you should change this password)
print('👑 Creating default admin user...');

const adminUser = {
  email: 'admin@trainingemployment.com',
  password_hash: '$2b$12$example.hash.change.in.production',
  name: 'System Administrator',
  role: 'admin',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
};

try {
  db.users.insertOne(adminUser);
  print('✅ Default admin user created');
} catch (error) {
  print('⚠️ Admin user might already exist: ' + error.message);
}

print('🎉 Training Employment Database setup complete!');
