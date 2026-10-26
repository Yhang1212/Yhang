const links=[['Explore the collection','products'],['Our approach','technology'],['Why HAILANG','about'],['Contact HAILANG','contact']];
function DiscoverList({onSection}) {
  return <aside className="mega-discover" aria-label="Discover"><p>Discover</p><ul>{links.map(([label,id])=><li key={id}><a href={'#'+id} onClick={(event)=>onSection(event,id)}>{label}</a></li>)}</ul></aside>;
}
export default DiscoverList;