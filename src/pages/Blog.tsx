import BlogTipsSection from '@/components/client/BlogTipsSection';
import ClientNavigation from '@/components/client/ClientNavigation';

const BlogPage = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from blog page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <BlogTipsSection />
      </div>
    </div>
  );
};

export default BlogPage;