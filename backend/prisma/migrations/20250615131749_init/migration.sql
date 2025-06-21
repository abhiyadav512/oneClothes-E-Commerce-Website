-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "isNew" BOOLEAN DEFAULT false,
ADD COLUMN     "isTrending" BOOLEAN DEFAULT false,
ADD COLUMN     "isWishlisted" BOOLEAN DEFAULT false,
ADD COLUMN     "originalPrice" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "sizes" TEXT[];
