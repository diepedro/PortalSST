INSERT INTO "users" (id, name, email, password, role, created_at)
VALUES (
  'cmm-coleta-teste-01',
  'Usuario Coleta',
  'coleta@meggawork.com',
  '$2b$12$ityAtMXRpLhW63gYIKKbCu4zIz8yvHEgitCg76IZHha3QJ3sjTVFW',
  'COLETA',
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET role = 'COLETA', password = EXCLUDED.password;
