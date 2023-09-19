import './NavPrev.css';


export default function NavPrev({ item }) {

  const classForItem = (currentItem) => (item === currentItem) ? 'nav active' : 'nav';

  var navItems = [];
  navItems.push({ id: "item1", link: "#", text: "Main subject 1", cssClass: classForItem("item1") })
  navItems.push({ id: "item2", link: "#", text: "Main subject 2", cssClass: classForItem("item2") })
  navItems.push({ id: "item3", link: "#", text: "Main subject 3", cssClass: classForItem("item3") })

  return (
    <div>
      <ul className="nav">
        {navItems.map((n, index) => (
          <li key={index} className={n.cssClass}>
            <a href={n.link}>{n.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


