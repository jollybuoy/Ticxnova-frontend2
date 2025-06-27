-- Ticxnova Database Schema
-- Run this script to create all necessary tables

-- Users table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    password_hash NVARCHAR(255) NULL, -- NULL for Microsoft auth users
    designation NVARCHAR(255) NULL,
    department NVARCHAR(255) NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'user', -- user, admin, manager
    auth_provider NVARCHAR(50) DEFAULT 'local', -- local, microsoft
    active BIT NOT NULL DEFAULT 1,
    is_online BIT NOT NULL DEFAULT 0,
    presence_status NVARCHAR(20) DEFAULT 'offline', -- online, away, busy, offline
    last_login DATETIME2 NULL,
    last_activity DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Tickets table
CREATE TABLE tickets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id NVARCHAR(50) NOT NULL UNIQUE,
    title NVARCHAR(500) NOT NULL,
    description NTEXT NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'Open', -- Open, In Progress, Completed, Closed
    priority NVARCHAR(10) NOT NULL, -- P1, P2, P3, P4
    ticket_type NVARCHAR(100) NOT NULL, -- Incident, Service Request, Change Request, Problem, Task
    department NVARCHAR(255) NOT NULL,
    assigned_to NVARCHAR(255) NULL,
    created_by NVARCHAR(255) NOT NULL,
    
    -- Additional fields for different ticket types
    planned_start DATETIME2 NULL,
    planned_end DATETIME2 NULL,
    requested_item NVARCHAR(500) NULL,
    justification NTEXT NULL,
    due_date DATETIME2 NULL,
    response_eta DATETIME2 NULL,
    resolution_eta DATETIME2 NULL,
    
    -- SLA tracking
    sla_met BIT NULL,
    response_time_minutes INT NULL,
    resolution_time_minutes INT NULL,
    
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    closed_at DATETIME2 NULL,
    
    FOREIGN KEY (created_by) REFERENCES users(email),
    FOREIGN KEY (assigned_to) REFERENCES users(email)
);

-- Ticket notes table
CREATE TABLE ticket_notes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NOT NULL,
    comment NTEXT NOT NULL,
    status NVARCHAR(50) NULL, -- Status change associated with this note
    created_by NVARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(email)
);

-- Chat messages table
CREATE TABLE chat_messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message NTEXT NOT NULL,
    message_type NVARCHAR(20) NOT NULL DEFAULT 'text', -- text, emoji, file
    read_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Frequent contacts table
CREATE TABLE frequent_contacts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    contact_id INT NOT NULL,
    last_contact DATETIME2 NOT NULL DEFAULT GETDATE(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (contact_id) REFERENCES users(id),
    UNIQUE(user_id, contact_id)
);

-- AI interactions table
CREATE TABLE ai_interactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    message NTEXT NOT NULL,
    page NVARCHAR(255) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI responses table
CREATE TABLE ai_responses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    user_message NTEXT NOT NULL,
    ai_response NTEXT NOT NULL,
    page NVARCHAR(255) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    message NTEXT NOT NULL,
    type NVARCHAR(50) NOT NULL DEFAULT 'info', -- info, success, warning, error
    read_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- File attachments table
CREATE TABLE file_attachments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id INT NULL,
    chat_message_id INT NULL,
    filename NVARCHAR(255) NOT NULL,
    original_filename NVARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(500) NOT NULL,
    uploaded_by INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (chat_message_id) REFERENCES chat_messages(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IX_tickets_status ON tickets(status);
CREATE INDEX IX_tickets_priority ON tickets(priority);
CREATE INDEX IX_tickets_department ON tickets(department);
CREATE INDEX IX_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX IX_tickets_created_by ON tickets(created_by);
CREATE INDEX IX_tickets_created_at ON tickets(created_at);

CREATE INDEX IX_chat_messages_sender_receiver ON chat_messages(sender_id, receiver_id);
CREATE INDEX IX_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX IX_users_email ON users(email);
CREATE INDEX IX_users_department ON users(department);
CREATE INDEX IX_users_last_activity ON users(last_activity);

CREATE INDEX IX_ticket_notes_ticket_id ON ticket_notes(ticket_id);
CREATE INDEX IX_notifications_user_id ON notifications(user_id);
CREATE INDEX IX_ai_interactions_user_id ON ai_interactions(user_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, name, password_hash, department, role, active)
VALUES (
    'admin@ticxnova.com',
    'System Administrator',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', -- admin123
    'IT',
    'admin',
    1
);

-- Insert sample users for demo
INSERT INTO users (email, name, password_hash, department, role, active) VALUES
('manager@ticxnova.com', 'Department Manager', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'Management', 'manager', 1),
('agent@ticxnova.com', 'Support Agent', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'Support', 'user', 1),
('user@ticxnova.com', 'End User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'General', 'user', 1);

-- Insert sample tickets for demo
INSERT INTO tickets (ticket_id, title, description, priority, ticket_type, department, assigned_to, created_by, status) VALUES
('INC-2024-001', 'Network connectivity issues in Building A', 'Users in Building A are experiencing intermittent network connectivity issues affecting their ability to access company resources.', 'P1', 'Incident', 'IT', 'agent@ticxnova.com', 'user@ticxnova.com', 'Open'),
('SR-2024-002', 'Request for new software installation', 'Need Adobe Creative Suite installed on workstation for design work.', 'P2', 'Service Request', 'IT', 'agent@ticxnova.com', 'user@ticxnova.com', 'In Progress'),
('CHG-2024-003', 'Server maintenance scheduled for weekend', 'Planned maintenance window for server updates and security patches.', 'P3', 'Change Request', 'IT', 'admin@ticxnova.com', 'admin@ticxnova.com', 'Completed');

PRINT 'Database schema created successfully!';
PRINT 'Default admin user: admin@ticxnova.com / admin123';
PRINT 'Sample users created with password: admin123, manager123, agent123, user123';