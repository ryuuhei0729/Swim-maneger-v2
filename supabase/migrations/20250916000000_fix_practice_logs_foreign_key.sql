-- Fix practice_logs foreign key to reference practices table instead of practice table

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE practice_logs 
DROP CONSTRAINT IF EXISTS practice_logs_practice_id_fkey;

-- Step 2: Add new foreign key constraint to reference practices table
ALTER TABLE practice_logs 
ADD CONSTRAINT practice_logs_practice_id_fkey 
FOREIGN KEY (practice_id) REFERENCES practices(id) ON DELETE CASCADE;

-- Step 3: Refresh the schema cache
NOTIFY pgrst, 'reload schema';
