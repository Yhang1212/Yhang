function BrandLogo({ inverse = false }) {
  return (
    <span className={`brand-logo${inverse ? ' brand-logo--inverse' : ''}`}>
      <span className="brand-logo__name">HAILANG</span>
    </span>
  );
}

export default BrandLogo;
