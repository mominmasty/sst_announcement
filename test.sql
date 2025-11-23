INSERT INTO announcements (title, description, category, author_id, link, is_active, status)
VALUES ('Test Announcement with Link', 'This is a test announcement with a link to https://google.com', 'college', 1, 'https://google.com', true, 'active')
RETURNING id, title, link;