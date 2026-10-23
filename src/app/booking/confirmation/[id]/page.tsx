export default async function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-forest">Booking confirmed</h1>
      <p className="mt-4 text-gray-600">Your booking reference is <strong>{id}</strong>.</p>
      <p className="mt-2 text-gray-500">A confirmation will be sent to your email address.</p>
    </div>
  );
}
