import { Helmet } from 'react-helmet-async';

const GoogleAnalytics = () => {
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Placeholder - usuario debe reemplazar

  return (
    <Helmet>
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
            page_location: window.location.href,
            custom_map: {
              'custom_parameter_1': 'barberia_location'
            }
          });
          
          // Eventos personalizados para barbería
          function trackBookingClick() {
            gtag('event', 'booking_click', {
              event_category: 'engagement',
              event_label: 'reservation_attempt'
            });
          }
          
          function trackServiceView(serviceName) {
            gtag('event', 'service_view', {
              event_category: 'services',
              event_label: serviceName
            });
          }
          
          function trackLocationView(locationName) {
            gtag('event', 'location_view', {
              event_category: 'locations',
              event_label: locationName
            });
          }
          
          // Hacer funciones disponibles globalmente
          window.trackBookingClick = trackBookingClick;
          window.trackServiceView = trackServiceView;
          window.trackLocationView = trackLocationView;
        `}
      </script>

      {/* Google Tag Manager */}
      <script>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX');
        `}
      </script>

      {/* Facebook Pixel */}
      <script>
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'XXXXXXXXXXXXXXXXX');
          fbq('track', 'PageView');
        `}
      </script>
      <noscript>
        {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=XXXXXXXXXXXXXXXXX&ev=PageView&noscript=1" />`}
      </noscript>
    </Helmet>
  );
};

export default GoogleAnalytics;