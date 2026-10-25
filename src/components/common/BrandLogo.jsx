function BrandLogo({ inverse = false }) {
  return (
    <span className={`brand-logo${inverse ? ' brand-logo--inverse' : ''}`}>
      <svg className="brand-logo__mark" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="10" fill="currentColor" />
        <path d="M9 12h7c3 0 4-2 7-2h4M9 18h7c3 0 4 2 7 2h4M9 24h7c3 0 4-2 7-2h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="brand-logo__name">HAILANG</span>
    </span>
  );
}

export default BrandLogo;
