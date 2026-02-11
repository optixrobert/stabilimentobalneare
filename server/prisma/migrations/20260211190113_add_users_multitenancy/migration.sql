/*
  Warnings:

  - Added the required column `userId` to the `beach_price_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `establishment_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `service_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `umbrella_spots` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_beach_price_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rowLabel" TEXT NOT NULL,
    "dailyPrice" DECIMAL NOT NULL DEFAULT 0.00,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "beach_price_rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_beach_price_rules" ("createdAt", "dailyPrice", "id", "rowLabel") SELECT "createdAt", "dailyPrice", "id", "rowLabel" FROM "beach_price_rules";
DROP TABLE "beach_price_rules";
ALTER TABLE "new_beach_price_rules" RENAME TO "beach_price_rules";
CREATE UNIQUE INDEX "beach_price_rules_userId_rowLabel_key" ON "beach_price_rules"("userId", "rowLabel");
CREATE TABLE "new_establishment_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Lido Manager',
    "rows" INTEGER NOT NULL DEFAULT 6,
    "cols" INTEGER NOT NULL DEFAULT 10,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "establishment_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_establishment_settings" ("cols", "createdAt", "id", "name", "rows", "updatedAt") SELECT "cols", "createdAt", "id", "name", "rows", "updatedAt" FROM "establishment_settings";
DROP TABLE "establishment_settings";
ALTER TABLE "new_establishment_settings" RENAME TO "establishment_settings";
CREATE UNIQUE INDEX "establishment_settings_userId_key" ON "establishment_settings"("userId");
CREATE TABLE "new_service_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "service_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_service_items" ("available", "category", "createdAt", "id", "name", "price") SELECT "available", "category", "createdAt", "id", "name", "price" FROM "service_items";
DROP TABLE "service_items";
ALTER TABLE "new_service_items" RENAME TO "service_items";
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("createdAt", "date", "id", "paymentMethod", "total") SELECT "createdAt", "date", "id", "paymentMethod", "total" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE TABLE "new_umbrella_spots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rowLabel" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'free',
    "sunbeds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "umbrella_spots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_umbrella_spots" ("createdAt", "id", "number", "rowLabel", "status", "sunbeds", "updatedAt") SELECT "createdAt", "id", "number", "rowLabel", "status", "sunbeds", "updatedAt" FROM "umbrella_spots";
DROP TABLE "umbrella_spots";
ALTER TABLE "new_umbrella_spots" RENAME TO "umbrella_spots";
CREATE UNIQUE INDEX "umbrella_spots_userId_rowLabel_number_key" ON "umbrella_spots"("userId", "rowLabel", "number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
