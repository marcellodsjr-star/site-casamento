-- ============================================================
-- SCRIPT SQL PARA SUPABASE - CASAMENTO THALITA & MARCELO
-- ============================================================
-- Este script cria todas as tabelas necessárias para o site
-- de casamento funcionar 100% com Supabase
-- ============================================================

-- Tabela de Usuários (Core)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Informações do Casamento
CREATE TABLE IF NOT EXISTS wedding_info (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  groom_name VARCHAR(255) NOT NULL,
  bride_name VARCHAR(255) NOT NULL,
  wedding_date VARCHAR(50) NOT NULL,
  wedding_time VARCHAR(50),
  location VARCHAR(255),
  location_url TEXT,
  description TEXT,
  theme VARCHAR(50) DEFAULT 'elegant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Convidados
CREATE TABLE IF NOT EXISTS wedding_guests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  relationship VARCHAR(100),
  num_guests INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  rsvp_status VARCHAR(50) DEFAULT 'pending',
  rsvp_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Padrinhos e Madrinhas
CREATE TABLE IF NOT EXISTS wedding_attendants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Presentes
CREATE TABLE IF NOT EXISTS wedding_gifts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  url TEXT,
  status VARCHAR(50) DEFAULT 'available',
  reserved_by VARCHAR(255),
  reserved_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fornecedores/Vendors
CREATE TABLE IF NOT EXISTS wedding_vendors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_type VARCHAR(100) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  price DECIMAL(10, 2),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Eventos/Timeline
CREATE TABLE IF NOT EXISTS wedding_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_name VARCHAR(255) NOT NULL,
  event_date VARCHAR(50) NOT NULL,
  event_time VARCHAR(50),
  location VARCHAR(255),
  description TEXT,
  event_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Despesas
CREATE TABLE IF NOT EXISTS wedding_expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  paid_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de RSVPs
CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  num_guests INTEGER DEFAULT 1,
  status VARCHAR(50) NOT NULL,
  dietary_restrictions TEXT,
  notes TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Mensagens/Recados
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  sender_phone VARCHAR(20),
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_wedding_info_user_id ON wedding_info(user_id);
CREATE INDEX idx_wedding_guests_user_id ON wedding_guests(user_id);
CREATE INDEX idx_wedding_attendants_user_id ON wedding_attendants(user_id);
CREATE INDEX idx_wedding_gifts_user_id ON wedding_gifts(user_id);
CREATE INDEX idx_wedding_vendors_user_id ON wedding_vendors(user_id);
CREATE INDEX idx_wedding_events_user_id ON wedding_events(user_id);
CREATE INDEX idx_wedding_expenses_user_id ON wedding_expenses(user_id);
CREATE INDEX idx_rsvps_user_id ON rsvps(user_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);

-- ============================================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVA SE NÃO QUISER)
-- ============================================================

-- Inserir usuário de teste
INSERT INTO users (email, name, role) VALUES 
('thalita@example.com', 'Thalita', 'user')
ON CONFLICT (email) DO NOTHING;

-- Inserir informações do casamento de teste
INSERT INTO wedding_info (user_id, groom_name, bride_name, wedding_date, wedding_time, location, theme)
SELECT id, 'Marcelo', 'Thalita', '20 de dezembro de 2026', '18:00', 'Espaço de Eventos Chácara Recanto Vale das Águas', 'elegant'
FROM users WHERE email = 'thalita@example.com'
ON CONFLICT DO NOTHING;

-- ============================================================
-- PERMISSÕES (Se estiver usando Supabase com RLS)
-- ============================================================

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_attendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (Usuários só veem seus próprios dados)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own wedding info" ON wedding_info
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own guests" ON wedding_guests
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own attendants" ON wedding_attendants
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own gifts" ON wedding_gifts
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own vendors" ON wedding_vendors
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own events" ON wedding_events
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own expenses" ON wedding_expenses
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own RSVPs" ON rsvps
  FOR SELECT USING (user_id = auth.uid()::int);

CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (user_id = auth.uid()::int);

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
-- Criado em: 15/05/2026
-- Versão: 1.0
-- Compatível com: Supabase PostgreSQL
-- ============================================================
