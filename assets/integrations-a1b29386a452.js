(() => {
  const config = window.PRODUCT_CONFIG;
  if (!config) return;
  const campaignParams = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','src','sck','xcod'];
  const current = new URLSearchParams(location.search);
  const attributionKey = 'lacos-de-cabelo-campaign-v1';
  const attributionLifetime = 7 * 24 * 60 * 60 * 1000;
  const hasIncomingAttribution = campaignParams.some(k => current.has(k));
  const validValue = value => value && value.length <= 500 && !/\{\{.*?\}\}/.test(value);
  if (!hasIncomingAttribution) {
    try {
      const saved = JSON.parse(localStorage.getItem(attributionKey) || 'null');
      if (saved && Date.now() - saved.savedAt < attributionLifetime) {
        campaignParams.forEach(k => {
          const value = saved.params?.[k];
          if (typeof value === 'string' && validValue(value)) current.set(k, value);
        });
      } else {
        localStorage.removeItem(attributionKey);
      }
    } catch { /* Storage unavailable; checkout still works with current URL. */ }
  }
  const values = ['utm_source','utm_campaign','utm_medium','utm_content','utm_term'].map(k => current.get(k) || '');
  if (!current.get('xcod') && values.some(Boolean) && !values.some(v => /\{\{.*?\}\}/.test(v))) current.set('xcod',values.join('hQwK21wXxR'));
  if (hasIncomingAttribution && (current.get('utm_campaign') || current.get('xcod') || current.get('sck'))) {
    try {
      const params = {};
      campaignParams.forEach(k => {
        const value = current.get(k);
        if (validValue(value)) params[k] = value;
      });
      localStorage.setItem(attributionKey, JSON.stringify({ savedAt: Date.now(), params }));
    } catch { /* Storage unavailable; current visit remains attributed. */ }
  }
  document.querySelectorAll('[data-checkout]').forEach(link => {
    const target = config.checkout[link.dataset.plan];
    if (!target) return;
    try {
      const url = new URL(target);
      if (url.protocol !== 'https:') return;
      campaignParams.forEach(k => { if (current.get(k)) url.searchParams.set(k,current.get(k)); });
      link.href = url.toString();
      link.removeAttribute('aria-disabled');
    } catch { /* Keep checkout inactive until its own valid URL is supplied. */ }
  });
  if (/^\d+$/.test(config.metaPixelId)) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init',config.metaPixelId);
    window.fbq('track','PageView');
    window.fbq('track','ViewContent',{content_name:config.name,content_category:config.category,content_ids:[config.id],content_type:'product',currency:'BRL'});
  }
  if (config.dashboardTrackerUrl) {
    const tracker = document.createElement('script');
    tracker.src = config.dashboardTrackerUrl;tracker.defer=true;tracker.dataset.dashboardTracker='';document.body.appendChild(tracker);
  }
  document.addEventListener('click',event => {
    const link = event.target.closest('[data-checkout]');
    if (!link) return;
    if (link.getAttribute('aria-disabled') === 'true') {event.preventDefault();return;}
    if (typeof window.fbq !== 'function' || !link.dataset.metaCheckoutValue) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.fbq('track','InitiateCheckout',{value:Number(link.dataset.metaCheckoutValue),currency:'BRL'});
    window.setTimeout(()=>{window.location.href=link.href;},350);
  });
})();
