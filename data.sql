DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

-- Insert sample users
INSERT INTO users (username, password, first_name, last_name, phone, join_at)
VALUES
    ('user1', 'password1', 'John', 'Doe', '1234567890', '2023-07-01 10:00:00'),
    ('user2', 'password2', 'Jane', 'Smith', '9876543210', '2023-07-01 11:00:00');

-- Insert sample messages
INSERT INTO messages (from_username, to_username, body, sent_at)
VALUES
    ('user1', 'user2', 'Hello, user2!', '2023-07-01 10:05:00'),
    ('user2', 'user1', 'Hi, user1!', '2023-07-01 10:10:00');
