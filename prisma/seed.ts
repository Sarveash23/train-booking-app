import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Create users with upsert
    console.log('Creating users...');
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: "john@example.com" },
            update: {},
            create: {
                name: "John Doe",
                email: "john@example.com",
                password: "hashed_password_1",
                phone: "+1234567890",
            },
        }),
        prisma.user.upsert({
            where: { email: "jane@example.com" },
            update: {},
            create: {
                name: "Jane Smith",
                email: "jane@example.com",
                password: "hashed_password_2",
                phone: "+1987654321",
            },
        }),
    ]);
    console.log('Users created:', users.length);

    // Create trains with upsert
    console.log('Creating trains...');
    const trains = await Promise.all([
        prisma.train.upsert({
            where: { train_number: "EXP101" },
            update: {},
            create: {
                train_number: "EXP101",
                origin: "New York",
                destination: "Boston",
                departure_date: new Date('2024-04-01T10:00:00Z'),
                return_date: new Date('2024-04-01T14:00:00Z'),
            },
        }),
        prisma.train.upsert({
            where: { train_number: "SF202" },
            update: {},
            create: {
                train_number: "SF202",
                origin: "Boston",
                destination: "Washington DC",
                departure_date: new Date('2024-04-02T09:00:00Z'),
                return_date: new Date('2024-04-02T15:00:00Z'),
            },
        }),
    ]);
    console.log('Trains created:', trains.length);

    // Create coaches with upsert
    console.log('Creating coaches...');
    const coaches = await Promise.all(
        trains.flatMap(train =>
            Array.from({ length: 6 }, (_, i) =>
                prisma.coach.upsert({
                    where: { id: `coach-${train.id}-${i + 1}` },
                    update: {},
                    create: {
                        id: `coach-${train.id}-${i + 1}`,
                        train_id: train.id,
                        coach_number: `C${i + 1}`,
                    },
                })
            )
        )
    );
    console.log('Coaches created:', coaches.length);

    // Create seats with upsert
    console.log('Creating seats...');
    const seats = await Promise.all(
        coaches.flatMap(coach =>
            Array.from({ length: 20 }, (_, i) =>
                prisma.seat.upsert({
                    where: { id: `seat-${coach.id}-${i + 1}` },
                    update: {},
                    create: {
                        id: `seat-${coach.id}-${i + 1}`,
                        coach_id: coach.id,
                        seat_number: `${i + 1}`,
                        is_locked: false,
                    },
                })
            )
        )
    );
    console.log('Seats created:', seats.length);

    // Create bookings with upsert
    console.log('Creating bookings...');
    const bookings = await Promise.all([
        prisma.booking.upsert({
            where: { id: "booking-1" },
            update: {},
            create: {
                id: "booking-1",
                user_id: users[0].id,
                train_id: trains[0].id,
                booking_status: "confirmed",
                total_amount: 100.00,
            },
        }),
    ]);
    console.log('Bookings created:', bookings.length);

    // Create booking seats with upsert
    console.log('Creating booking seats...');
    await prisma.bookingSeat.upsert({
        where: { id: "booking-seat-1" },
        update: {},
        create: {
            id: "booking-seat-1",
            booking_id: bookings[0].id,
            seat_id: seats[0].id,
        },
    });

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error('Error in seed script:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });