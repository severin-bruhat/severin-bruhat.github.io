
// api/medium.js
const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
    const MEDIUM_RSS_URL = 'https://medium.com/feed/@severin_bruhat';

    try {
        const feed = await parser.parseURL(MEDIUM_RSS_URL);
        const articles = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            // You can add more fields if needed, e.g., categories, author
        }));

        // Filter out any non-article links if necessary (e.g., claps, responses)
        const filteredArticles = articles.filter(article =>
            article.link && article.link.includes('medium.com/') && !article.link.includes('/p/') // Basic filter for typical article URLs
        ).slice(0, 5); // Get the latest 5 articles, adjust as needed

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
        res.status(200).json(filteredArticles);

    } catch (error) {
        console.error('Error fetching Medium articles:', error);
        res.status(500).json({ error: 'Failed to fetch Medium articles', details: error.message });
    }
};