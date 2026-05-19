import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import sequelize from '../src/lib/db.js';
import User from '../src/models/User.js';
import Blog from '../src/models/Blog.js';
import Seo from '../src/models/Seo.js';
import Lead from '../src/models/Lead.js';

async function main() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'Root@123';
  const database = process.env.DB_NAME || 'galaxy_movers';

  console.log(`Connecting to MySQL server at ${host}...`);

  // Create database if not exists
  const connection = await mysql.createConnection({ host, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();

  console.log(`Database "${database}" verified/created successfully.`);

  // Authenticate Sequelize
  await sequelize.authenticate();
  console.log('Sequelize connected successfully.');

  // Sync models
  await sequelize.sync({ force: false, alter: true });
  console.log('Database models synced successfully.');

  // Seed default Admin User
  const adminEmail = 'admin@galaxymovers.ca';
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@12345', 10);
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    console.log(`Created default admin user: ${adminEmail} (password: Admin@12345)`);
  } else {
    console.log(`Admin user ${adminEmail} already exists.`);
  }

  // Seed Initial SEO Settings
  const initialSeo = [
    {
      page_path: '/',
      title: 'Galaxy Movers Canada | Stress-Free Moving Across Canada',
      description: "Canada's most trusted moving company. Providing professional packing, local, and long-distance moving services coast to coast. Get a free quote in 60 seconds!",
      keywords: 'moving company canada, galaxy movers, professional movers, cross country moving, same day movers',
      canonical_url: 'https://galaxymovers.ca',
      og_title: 'Galaxy Movers Canada - Professional Coast-to-Coast Moving',
      og_description: 'Stress-free residential and commercial moves across Canada. Fully licensed and insured team.',
      og_image: '/images/hero-bg.jpg',
      header_scripts: `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DEMO12345"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DEMO12345');
</script>`,
      footer_scripts: `<!-- Footer Verification Scripts -->`
    },
    {
      page_path: '/blog',
      title: 'Galaxy Movers Blog | Moving Tips, Guides & Checklists',
      description: 'Expert moving tips, relocation guides, and packing checklists from professional Canadian movers. Make your next move smooth and simple!',
      keywords: 'moving tips, packing checklist, relocation guide, house moving advice',
      canonical_url: 'https://galaxymovers.ca/blog',
      og_title: 'Moving Insights & Checklists | Galaxy Movers Canada',
      og_description: 'Discover expert moving strategies, packing hacks, and country-wide relocation guides.',
      og_image: '/images/blog-default.jpg'
    }
  ];

  for (const seoItem of initialSeo) {
    const [record, created] = await Seo.findOrCreate({
      where: { page_path: seoItem.page_path },
      defaults: seoItem
    });
    if (created) {
      console.log(`Seeded SEO metadata for path: ${seoItem.page_path}`);
    } else {
      console.log(`SEO metadata for ${seoItem.page_path} already exists.`);
    }
  }

  // Seed sample Blogs if none exist
  const existingBlogs = await Blog.count();
  if (existingBlogs === 0) {
    const sampleBlogs = [
      {
        title: 'The Ultimate Packing Guide: 10 Tips for a Stress-Free Move',
        slug: 'ultimate-packing-guide-moving-tips',
        excerpt: 'Packing up an entire house can feel overwhelming. Follow these 10 expert packing tips to streamline your moving day and protect your fragile items.',
        content: `<h2>Mastering the Art of Packing</h2>
<p>Moving to a new home is an exciting milestone, but the process of packing up all your worldly possessions can quickly become daunting. To help you stay organized and ensure your items arrive safely, our expert moving specialists at <strong>Galaxy Movers Canada</strong> have compiled this ultimate packing guide.</p>

<h3>1. Start Early and Declutter</h3>
<p>The golden rule of packing is simple: don't move what you don't need. Take time to go through each room and separate items to keep, donate, sell, or throw away. Packing will be faster, and you will save money on moving costs since there is less volume to transport.</p>

<h3>2. Invest in High-Quality Packing Supplies</h3>
<p>It can be tempting to grab free grocery boxes, but they are often structurally weakened. Invest in heavy-duty cardboard boxes, bubble wrap, packing paper, and strong packing tape. Professional materials ensure your boxes stack safely inside the truck without collapsing.</p>

<h3>3. Use the "Heavy at Bottom" Rule</h3>
<p>Always place heavier items (like books or kitchen appliances) at the bottom of the box, and lighter items (like clothing or pillows) on top. This maintains the box's center of gravity and prevents items from getting crushed.</p>

<h3>4. Label Everything Strategically</h3>
<p>Write the destination room and a brief list of contents on at least two sides of every box. You can also color-code your labels by room (e.g., Red for Kitchen, Blue for Master Bedroom) to help the movers place boxes in the right spots immediately.</p>

<h3>5. Wrap Fragile Items Separately</h3>
<p>Wrap glasses and plates individually in clean packing paper or bubble wrap. Stack plates vertically like vinyl records rather than flat, which makes them less vulnerable to vibrations during transport.</p>

<h3>6. Prepare a "First-Night" Essentials Box</h3>
<p>Pack a designated suitcase or clear plastic bin with everything you need for your first 24 hours in the new home. Include toiletries, pajamas, a change of clothes, basic chargers, snacks, and essential tools like a box cutter.</p>

<h2>Conclusion</h2>
<p>By taking a structured, organized approach to packing, you can eliminate moving-day chaos. If packing still sounds like too much to handle, remember that <strong>Galaxy Movers Canada</strong> offers full professional packing services. We'll wrap, pack, and secure all your belongings for you!</p>`,
        image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
        author: 'John Doe',
        status: 'published',
        publishedAt: new Date(),
        faqs: JSON.stringify([
          { q: 'How many boxes do I need for a 2-bedroom house?', a: 'On average, a 2-bedroom home requires around 30 to 45 medium-to-large cardboard boxes, along with specialty boxes for wardrobes and dishes.' },
          { q: 'Can professional movers pack everything for me?', a: 'Yes! Galaxy Movers offers full-service packing. Our trained crew will handle everything from delicate glassware to bulky electronics safely.' }
        ])
      },
      {
        title: '5 Crucial Questions to Ask Before Hiring a Moving Company',
        slug: 'questions-to-ask-hiring-movers',
        excerpt: 'Not all moving companies are created equal. Protect your belongings and your wallet by asking these 5 essential questions before making a booking.',
        content: `<h2>Choosing the Right Moving Partner</h2>
<p>Hiring professional movers is one of the best ways to make your relocation stress-free. However, with so many moving companies out there, it is vital to perform due diligence. To protect yourself from rogue movers and hidden costs, make sure to ask these five critical questions before signing any contract.</p>

<h3>1. Are you fully licensed and insured?</h3>
<p>This is the most important question. A reputable moving company should have active transport licenses and comprehensive public liability and cargo insurance. <strong>Galaxy Movers Canada</strong> is fully licensed and insured, meaning your belongings are legally protected at every stage of the journey.</p>

<h3>2. How do you calculate your moving rates?</h3>
<p>Ensure you understand the pricing structure. Is it an hourly rate, a flat fee, or based on the weight and volume of the cargo? Ask if there are peak-day premiums (like weekends or end-of-the-month slots) and get a detailed written quote that clearly itemizes all charges.</p>

<h3>3. Are there any potential hidden fees?</h3>
<p>Some moving companies charge additional fees for flights of stairs, long-walk carries, fuel surcharges, or assembly. A transparent mover will tell you about these upfront. At Galaxy Movers, we believe in honest, upfront pricing with no hidden fees.</p>

<h3>4. What is your cancellation or rescheduling policy?</h3>
<p>Plans can change unexpectedly when buying or selling homes. Ask how far in advance you can cancel or change your moving date without forfeiting your deposit or incurring penalty fees.</p>

<h3>5. Do you offer packing and storage solutions if needed?</h3>
<p>Relocating is rarely linear. Often, you might need short-term storage between closing dates, or professional packing help. Choosing a full-service moving company that provides secure climate-controlled storage and packing makes coordinating much simpler.</p>

<h2>Choose Trust and Transparency</h2>
<p>Your home and belongings are precious. Don't leave them in the hands of unverified movers. Partner with an experienced, transparent team like <strong>Galaxy Movers Canada</strong> to enjoy peace of mind throughout your relocation.</p>`,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        author: 'Jane Smith',
        status: 'published',
        publishedAt: new Date(),
        faqs: JSON.stringify([
          { q: 'What happens if an item gets damaged during transit?', a: 'With Galaxy Movers, your items are fully covered by cargo insurance. We have a streamlined claims process to resolve any rare damage issues promptly.' },
          { q: 'Do you offer flat-rate pricing?', a: 'Yes! For long-distance moves or large residential moves, we can provide a guaranteed flat-rate quote based on an inventory list.' }
        ])
      }
    ];

    for (const blogItem of sampleBlogs) {
      await Blog.create(blogItem);
      console.log(`Seeded blog post: ${blogItem.title}`);
    }
  } else {
    console.log('Sample blog posts already exist.');
  }

  console.log('Database initialization completed successfully!');
}

main().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
