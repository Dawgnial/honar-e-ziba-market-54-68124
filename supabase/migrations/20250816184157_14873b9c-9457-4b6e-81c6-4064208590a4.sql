-- Test inserting a comment to debug the issue
INSERT INTO product_comments (product_id, user_name, rating, comment, is_approved) 
VALUES (
  '1', 
  'تست کاربر', 
  5, 
  'این یک تست است تا ببینیم آیا کامنت‌ها insert می‌شوند یا نه', 
  false
);