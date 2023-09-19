import 'bootstrap/dist/css/bootstrap.min.css';


export default function Row() {

  const url = "https://art-yeshiva.org.il/";
  var rows = [
    {
      img: { src: `${url}/Images/AYmain/003.jpg`, alt: "תמונה" },
      // img: { src: `${url}/Images/AYmain/003.jpg`, alt: "תמונה" },
      item: {
        header: "קודש", text: `הישיבה לאומנויות ולמדעים היא בראש ובראשונה ישיבה, וככזו היא שמה דגש על לימודי הקודש וקיום מצוות,
      היא רואה את יעודה להצמיח תלמידים אוהבי תורה ויראי שמים, בעלי אמונה עובדי ה´ באהבה ובשמחה. הלימודים
      בישיבה מורכבים מלימודי גמרא, הלכה, תנ"ך ומחשבת ישראל. הישיבה מדרבנת את תלמידיה לחשוב באופן עצמאי ולפתח
      יצירתיות בהבנת מקורות ההלכה והמחשבה היהודית...`, link: `${url}MoreInfo.aspx?pi=11`
      }
    },
    {
      img: { src: `${url}/Images/AYmain/012.jpg`, alt: "תמונה" },
      item: {
        header: "אמנות", text: `מגמת אמנות היא מגמה הומניסטית הרואה באמנות דרך חשובה ומפרה להתפתחות בני הנוער. העיסוק וההתנסות
      בתחומי האמנות, מאפשרת העמקת המודעות העצמית ומפתחת יכולת ביטוי אישית ומקורית. לימודי האמנות מגרים את
      הסקרנות ומפתחים כשרים חדשים של התבוננות אל הסביבה. הלימוד מפרה ומעשיר בתכנים תרבותיים, מעניק כלים
      אינטלקטואליים ואסתטיים.
      <br><b>מטרות מוגדרות:</b>
      <br>הכרות...`, link: `${url}MoreInfo.aspx?pi=12`
      }
    },
    {
      img: { src: `${url}/Images/AYmain/007.jpg`, alt: "תמונה" },
      item: {
        header: "מוזיקה", text: `מגמת המוסיקה היא בית לתלמידים שעוסקים במוסיקה ומעוניינים להתמסר לפיתוח כשרונם, המגמה היא
      רב-תחומית וניתן להשתלב ולהתמחות בשלל ז´אנרים מוסיקליים. הרכבי הנגינה מתקיימים במסגרות רב שכבתיות,
      ויוצרים אווירה מיוחדת וגיבוש חברתי. המגמה חותרת לאיכות, למצוינות, להרחבת אופקים, למיומנויות גבוהות,
      לחיפוש ולחדשנות. לצד הדרישות הגבוהות אנחנו מאמינים בעבודת צוות...`, link: `${url}MoreInfo.aspx?pi=13`
      }
    },
    // {
    //   img: { src: `${url}/Images/AYmain/012.jpg`, alt: "תמונה" },
    //   item: { header: "", text: ``, link: `${url}MoreInfo.aspx?pi=14` }
    // },
    // {
    //   img: { src: `${url}/Images/AYmain/012.jpg`, alt: "תמונה" },
    //   item: { header: "", text: ``, link: `${url}MoreInfo.aspx?pi=15` }
    // },

  ];

  return (
    <div className="container" dir="rtl">
      {rows.map((r, index) => (
        <div key={index} className="row pt-5 mt-3">
          <div className={`col-md-9 ${index % 2 == 0 ? "order-md-1" : "order-md-2"}`}>
            <img className="img-fluid" src={r.img.src} alt={r.img.alt} />
          </div>
          <div className={`col-md-3 ${index % 2 == 1 ? "order-md-1" : "order-md-2"}`}>
            <h3>{r.item.header}</h3>
            <p>{r.item.text}</p>
            <a href={r.item.link}><small className="text-muted">מידע נוסף</small></a>
          </div>
        </div>
      ))}
    </div>
  );
}


