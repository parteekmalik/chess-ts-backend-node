-- AlterTable
CREATE SEQUENCE puzzles_id_seq;
ALTER TABLE "puzzles" ALTER COLUMN "id" SET DEFAULT nextval('puzzles_id_seq');
ALTER SEQUENCE puzzles_id_seq OWNED BY "puzzles"."id";
