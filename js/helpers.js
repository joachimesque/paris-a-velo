/*jshint esversion:6 */
//

const slugify = (text = "", separator) => {
  text = text.toString().toLowerCase().trim();

  const sets = [
    { to: "a", from: "[ÀÁÂÃÄÅĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]" },
    { to: "ae", from: "[Æ]" },
    { to: "c", from: "[ÇĆĈČ]" },
    { to: "d", from: "[ÐĎĐÞ]" },
    { to: "e", from: "[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]" },
    { to: "g", from: "[ĜĞĢǴ]" },
    { to: "h", from: "[ĤḦ]" },
    { to: "i", from: "[ÌÍÎÏĨĪĮİỈỊ]" },
    { to: "j", from: "[Ĵ]" },
    { to: "ij", from: "[Ĳ]" },
    { to: "k", from: "[Ķ]" },
    { to: "l", from: "[ĹĻĽŁ]" },
    { to: "m", from: "[Ḿ]" },
    { to: "n", from: "[ÑŃŅŇ]" },
    { to: "o", from: "[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]" },
    { to: "oe", from: "[Œ]" },
    { to: "p", from: "[ṕ]" },
    { to: "r", from: "[ŔŖŘ]" },
    { to: "s", from: "[ŚŜŞŠ]" },
    { to: "ss", from: "[ß]" },
    { to: "t", from: "[ŢŤ]" },
    { to: "u", from: "[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]" },
    { to: "w", from: "[ẂŴẀẄ]" },
    { to: "x", from: "[ẍ]" },
    { to: "y", from: "[ÝŶŸỲỴỶỸ]" },
    { to: "z", from: "[ŹŻŽ]" },
    { to: "-", from: "[·•/—–_,:;'‘’«»“”]" },
  ];

  sets.forEach(set => {
    text = text.replace(new RegExp(set.from, "gi"), set.to);
  });

  text = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-et-") // Replace & with 'et'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

  if (typeof separator !== "undefined" && separator !== "-") {
    text = text.replace(/-/g, separator);
  }

  return text;
};


// array utils
const arrayHasValue = (array, value) => {
  return array.indexOf(value) >= 0;
};

const arrayAddValue = (array, value) => {
  const index = array.indexOf(value);
  if (index <= -1) {
    array.push(value);
  }
  return array;
};

const arrayRemoveValue = (array, value) => {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

// detect touch screens

const isTouchEnabled = () => ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const isClickEnabled = () => ('onclick' in window);
