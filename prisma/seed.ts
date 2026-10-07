import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Create Admin User ───
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'smnt.mukherjee@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'smnt.mukherjee@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ─── Create Rooms ───
  const rooms = [
    {
      slug: 'deluxe-room',
      name: 'Deluxe Room',
      description:
        'A cozy and elegant room with modern amenities and air conditioning for a comfortable stay. Enjoy private balcony views of the lush green surroundings.',
      pricePerNight: 2500,
      maxGuests: 2,
      bedType: 'King Bed',
      roomSize: '250 sq ft',
      inventoryCount: 5,
      images: ['/room-1.jpg'],
      amenities: ['Air Conditioning', 'Free WiFi', 'Room Service', 'Hot Water', 'TV', 'Balcony'],
      status: 'AVAILABLE',
      featured: true,
    },
    {
      slug: 'luxury-tent',
      name: 'Luxury Forest Tent',
      description:
        'Experience glamping at its best with cozy tents surrounded by lush green lawns and nature. Perfect for couples seeking a unique outdoor experience.',
      pricePerNight: 2000,
      maxGuests: 2,
      bedType: 'Double Bed',
      roomSize: '200 sq ft',
      inventoryCount: 8,
      images: ['/room-2.jpg'],
      amenities: ['Fan', 'Charging Points', 'Bedding', 'Lamp', 'Outdoor Seating'],
      status: 'AVAILABLE',
      featured: true,
    },
    {
      slug: 'family-cottage',
      name: 'Family Cottage',
      description:
        'An independent cottage perfect for families, offering privacy, ample space, and garden access. Includes a private sit-out area with garden views.',
      pricePerNight: 4500,
      maxGuests: 5,
      bedType: 'King + Twin Beds',
      roomSize: '400 sq ft',
      inventoryCount: 3,
      images: ['/gallery-1.jpg'],
      amenities: ['Air Conditioning', 'Free WiFi', 'Room Service', 'Hot Water', 'TV', 'Garden Access', 'Private Sit-out'],
      status: 'AVAILABLE',
      featured: true,
    },
  ];

  for (const room of rooms) {
    const created = await prisma.room.upsert({
      where: { slug: room.slug },
      update: room,
      create: room,
    });
    console.log(`✅ Room: ${created.name} (${created.inventoryCount} units)`);
  }

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
