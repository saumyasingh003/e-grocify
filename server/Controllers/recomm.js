import Product from "../Models/product.js";

const tokenize = (text = "") =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

const jaccard = (a, b) => {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
};

const priceScore = (p1, p2) => {
  const diff = Math.abs(p1 - p2);
  const avg = (p1 + p2) / 2;
  return Math.max(0, 1 - diff / avg);
};

export const getSimilarProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    // Convert slug → product name
    const productName = slug.replace(/-/g, " ");

    // Get the clicked product
    const source = await Product.findOne({
      name: { $regex: new RegExp(`^${productName}$`, "i") }
    }).lean();

    if (!source)
      return res.status(404).json({ success: false, message: "Product not found" });

    const products = await Product.find({
      _id: { $ne: source._id }
    }).lean();

    const srcTags = source.tags.map(t => t.toLowerCase());
    const srcTokens = tokenize(source.description);
    const srcPrice = source.price;
    const srcCat = source.category.toLowerCase();

    const WEIGHT = {
      tags: 0.5,
      category: 0.2,
      description: 0.2,
      price: 0.1
    };

    const scored = products.map(p => {
      const tags = (p.tags || []).map(t => t.toLowerCase());
      const descTokens = tokenize(p.description);

      const tagScore = jaccard(srcTags, tags);
      const catScore = p.category.toLowerCase() === srcCat ? 1 : 0;
      const descScore = jaccard(srcTokens, descTokens);
      const prScore = priceScore(srcPrice, p.price);

      const finalScore =
        tagScore * WEIGHT.tags +
        catScore * WEIGHT.category +
        descScore * WEIGHT.description +
        prScore * WEIGHT.price;

      return { ...p, similarity: finalScore };
    });

    const recommendations = scored.sort((a, b) => b.similarity - a.similarity).slice(0, 10);

    return res.json({
      success: true,
      recommended: recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
