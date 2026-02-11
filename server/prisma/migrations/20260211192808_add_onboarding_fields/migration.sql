-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_establishment_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Lido Manager',
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "rows" INTEGER NOT NULL DEFAULT 6,
    "cols" INTEGER NOT NULL DEFAULT 10,
    "isSetupCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "establishment_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_establishment_settings" ("cols", "createdAt", "id", "name", "rows", "updatedAt", "userId") SELECT "cols", "createdAt", "id", "name", "rows", "updatedAt", "userId" FROM "establishment_settings";
DROP TABLE "establishment_settings";
ALTER TABLE "new_establishment_settings" RENAME TO "establishment_settings";
CREATE UNIQUE INDEX "establishment_settings_userId_key" ON "establishment_settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
