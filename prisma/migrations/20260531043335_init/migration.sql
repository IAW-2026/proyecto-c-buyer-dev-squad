/*
  Warnings:

  - The values [COMPLETED,CANCELLED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `image` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `size` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `deliveryType` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverPhone` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "image" TEXT NOT NULL,
ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryType" TEXT NOT NULL,
ADD COLUMN     "receiverName" TEXT NOT NULL,
ADD COLUMN     "receiverPhone" TEXT NOT NULL,
ADD COLUMN     "shippingAddress" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "direction" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_brand_idx" ON "products"("brand");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "products_category_brand_idx" ON "products"("category", "brand");

-- CreateIndex
CREATE INDEX "products_category_price_idx" ON "products"("category", "price");
