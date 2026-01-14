import { Helmet } from 'react-helmet-async';

const GoogleAnalytics = () => {
  const GA_MEASUREMENT_ID = 'G-SKYK9EFR5Y';

  return (
    <Helmet>
      <title>Mad Men Barbería Tradicional</title>
      <meta name="description" content="Mad Men Barbería - El arte de la barbería tradicional perfeccionado en Madrid. Corte clásico, afeitado con navaja y cuidado masculino premium." />
      {/* Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href
          });
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
