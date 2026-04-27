export const fallbackProducts = [
  {
    id: 1,
    name_ar: "توتِّي",
    name_en: "TOTTI",
    desc_ar:
      "عطر خشبي زهري فاخر بلمسة عصرية، يفتتح بانتعاش البرغموت وزهر البرتقال، ويستقر على قاعدة دافئة من الأخشاب والباتشولي ولمسة مسكية جذابة.",
    desc_en:
      "A refined woody floral fragrance with a modern opening of bergamot and orange blossom, settling into warm woods, patchouli, and an alluring musky trail.",
    notes_ar: "البرغموت • زهر البرتقال • الأخشاب الدافئة • الباتشولي • المسك",
    notes_en: "Bergamot • Orange Blossom • Warm Woods • Patchouli • Musk",
    price_50ml: 299,
    original_price_50ml: 349,
    image: "/images/totti.png",
  },
  {
    id: 2,
    name_ar: "بسيوني",
    name_en: "Basiony",
    desc_ar:
      "عطر فاخر يلتقي فيه انتعاش الكمثرى واللافندر بحرارة القرفة، ثم يذوب في سحابة دافئة ولذيذة من الكراميل والفانيليا والعسل لحضور جذاب يدوم طويلاً.",
    desc_en:
      "A luxurious fragrance where fresh pear and lavender meet the warmth of cinnamon, then melt into a rich trail of caramel, vanilla, and honey for a lasting captivating presence.",
    notes_ar: "الكمثرى • اللافندر • القرفة • الكراميل • الفانيليا • العسل",
    notes_en: "Pear • Lavender • Cinnamon • Caramel • Vanilla • Honey",
    price_50ml: 299,
    original_price_50ml: 349,
    image: "/images/basiony.png",
  },
  {
    id: 3,
    name_ar: "الفؤاد",
    name_en: "Al-Fouad",
    desc_ar:
      "عطر فاخر يجمع انتعاش المريمية بحدة الزنجبيل ولمسة توابل دافئة، قبل أن يستقر على فيتيفر مدخن يمنحك حضوراً رجولياً غامضاً يدوم طويلاً.",
    desc_en:
      "A refined scent blending the freshness of sage with sharp ginger and warm spices, settling into smoky vetiver for a bold, masculine presence that lasts.",
    notes_ar: "المريمية • الزنجبيل • التوابل الدافئة • الفيتيفر • الأخشاب المدخنة",
    notes_en: "Sage • Ginger • Warm Spices • Vetiver • Smoky Woods",
    price_50ml: 299,
    original_price_50ml: 349,
    image: "/images/al-fouad.png",
  },
];

export function getFallbackProductById(id) {
  return fallbackProducts.find((product) => product.id === Number(id)) ?? null;
}
