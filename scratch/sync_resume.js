const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eqrqufobzwblesdrhtgi.supabase.co';
const supabaseKey = 'sb_publishable_938DcrTJsIvVxLWRvkcCxw_XbX0b0dg';
const supabase = createClient(supabaseUrl, supabaseKey);

const resumeData = {
  profile: {
    name: "Ahmed Rakib Uddin",
    title: "Chief Executive Officer | Strategic Leader",
    bio: "Dynamic strategic professional with 18 years of leadership experience, specializing in the development of complex technological products and scalable business and growth operations across Fintech, SME, telecom and service. Blends deep technical expertise with strategic business acumen, using user behavior analysis and business modeling to drive innovation. A customer-focused leader with a proven ability to translate market needs into successful product and business strategies. Delivered measurable impact in managing very optimum cost operation through process re-engineering, automation, and governance best practices.",
    phone: "+880 1841 672 217",
    email: "rakib_2001331022@yahoo.com",
    location: "Dhaka, Bangladesh",
    years_experience: "18+",
    gtv_growth: "10x",
    merchant_growth: "3x",
    tech_cost_cut: "75%"
  },
  competencies: [
    { name: "Business Transformation & Turnarounds", evidence: "Driving large-scale transformations, restoring profitability, embedding cost discipline, and leading cross-functional teams through periods of crisis.", category: "competency", order_index: 0 },
    { name: "Growth & Revenue Strategy", evidence: "Creating and executing strategies for new revenue streams, innovative products, distribution channels, and process improvisation.", category: "competency", order_index: 1 },
    { name: "Technological Product Innovation", evidence: "Develop and implement scalable and efficient data-driven product strategies to build the right business product.", category: "competency", order_index: 2 },
    { name: "Strategic Partnership", evidence: "Partner up with right fit organizations to establish partnerships as important revenue and a solid growth channel.", category: "competency", order_index: 3 }
  ],
  experiences: [
    {
      company: "Sheba Merchants Ltd",
      role: "Chief Executive Officer",
      location: "Dhaka, Bangladesh",
      duration: "Feb 2025 – Present",
      contribution: "Technological product transformation and modernization to make the product business ready, drive early growth and fixed necessary business processes to scale up the business.",
      bullets: [
        "Product transformation and modernized, launched digital payment collection service which resulted 10x GTV growth in 5 months",
        "1.5X subscription revenue growth in 6 months and 5 M BDT revenue generation from alternate source",
        "3X Merchant number growth securing growth of north star matrix for the business",
        "Directed strategic improvements in sales strategy & operations, cutting sales complaints and refunds from 7% to 3% and improved Contribution margin from 15% to 28%",
        "Reduced high value merchant churn rate from 9% to 4%"
      ],
      metrics: ["10x GTV Growth", "1.5x Subscription Rev"],
      order_index: 1
    },
    {
      company: "Sheba Fintech Limited",
      role: "Deputy Chief Executive Officer",
      location: "Dhaka, Bangladesh",
      duration: "Jun 2023 – Jan 2025",
      contribution: "Technological and compliance readiness of the organization at lowest possible cost to avail PSP license from Bangladesh Bank, Make the organization commercial ready and launch sheba pay service in the market.",
      bullets: [
        "With a team without any Technological and Fintech background, with extremely limited budget, assembled a group of experts and completed all necessary readiness for Bangladesh Bank Audit for PSP license at single attempt",
        "Partnered with major banks, MFS and PSOs, Set up total Fintech eMoney operation along with necessary reporting structure with Bangladesh Bank",
        "Tested Sheba Pay wallet for merchants, Launched commercially, migrated all merchants from old structure to new wallet system, started generating revenue"
      ],
      metrics: [],
      order_index: 2
    },
    {
      company: "Sheba Platform Limited",
      role: "Chief Strategy Officer",
      location: "Dhaka, Bangladesh",
      duration: "Oct 2022 – Jun 2023",
      contribution: "Helped the company to survive a possible business shut down, liaison with board member and share holders to avail interim breath investment, streamlined scaled down operation, kept all business alive, despite all odds revenue almost doubled up.",
      bullets: [
        "Optimized 75% Technology cost and defined operational and development procedure to keep business running as it is and alive",
        "Optimized 60% Business Operation cost, defined new processes to improved overall efficiency and productivity",
        "Drive the business to double growth despite all odds to maintain the business profile attractive to existing and new investors"
      ],
      metrics: ["75% Tech Cost Cut", "60% Ops Cost Cut"],
      order_index: 3
    },
    {
      company: "Sheba Platform Limited",
      role: "Senior Vice President",
      location: "Dhaka, Bangladesh",
      duration: "Jan 2022 – Sep 2022",
      contribution: "Joined the team and took over business operations to accelerate hyper growth to make business metrics acceptable to be considered for VC investment.",
      bullets: [
        "Tune commercial strategy to make the product market fit and drive 3 times active merchants growth in 4 months",
        "Introduce new product line to drive Gross Transaction value double in 4 months"
      ],
      metrics: ["3x Merchant Growth"],
      order_index: 4
    },
    {
      company: "ADN Telecom",
      role: "Senior Manager, Regional and Retail Business",
      location: "Dhaka, Bangladesh",
      duration: "Dec 2020 – Jan 2022",
      contribution: "Expanding Regional Business to 6 Districts and initiating pilot projects for rural connectivity.",
      bullets: [
        "Improved infrastructure and Bandwidth cost almost 25% by negotiating with partners and portfolio rearrangement",
        "Expanding Regional Business to 6 Districts",
        "Initiated the Pilot project of rural WiFi, from technical solution to business case validation and 5 hotspots implementation"
      ],
      metrics: ["25% Bandwidth Cost Cut"],
      order_index: 5
    },
    {
      company: "Imagine Radio",
      role: "Co-founder and Chief Operating Officer",
      location: "Dhaka, Bangladesh",
      duration: "Jan 2019 – Oct 2020",
      contribution: "First ever local built cross platform music streaming application.",
      bullets: [
        "Reached 100K monthly active users in 1 year time",
        "Established the first local cross-platform music streaming service"
      ],
      metrics: ["100K MAU"],
      order_index: 6
    },
    {
      company: "QUBEE",
      role: "Manager, Business Process & Service Innovation / RAN",
      location: "Dhaka, Bangladesh",
      duration: "Jun 2010 – Dec 2018",
      contribution: "Optimizing operational efficiency and network delivery.",
      bullets: [
        "Established 3rd party delivery partner services first time to distribute devices to customer doorsteps",
        "Optimized the operational cost of infrastructure yearly 25% by negotiating and portfolio rearrangement",
        "Delivered Critical network antenna swap project without any network and revenue compromise"
      ],
      metrics: ["25% Yearly Ops Cut"],
      order_index: 7
    },
    {
      company: "LM ERICSSON Bangladesh Ltd",
      role: "Implementation Manager",
      location: "Dhaka, Bangladesh",
      duration: "May 2007 – Jun 2010",
      contribution: "Project delivery and service cost optimization.",
      bullets: [
        "Replaced Foreign experienced resource in 1 year to reduce significant cost of service",
        "Delivered and handed over successfully a long pending country wide Microwave SDH transmission project of Warid telecom (now Airtel) in just 6 months"
      ],
      metrics: [],
      order_index: 8
    }
  ],
  education: [
    { institution: "East West University", degree: "MBA in Finance", duration: "2010 - 2012", order_index: 1 },
    { institution: "Shah Jalal University of Science & Technology", degree: "B.Sc. in CSE", duration: "2002 - 2007", order_index: 2 },
    { institution: "Professional Credentials", degree: "PRINCE2® Certifications", duration: "Foundation & Practitioner", order_index: 3 }
  ]
};

async function syncResume() {
  console.log('Syncing Resume Data...');

  // 1. Sync Profile Config (in skills table)
  const profileEntries = Object.entries(resumeData.profile).map(([key, value]) => ({
    name: key,
    evidence: value.toString(),
    category: 'profile_config',
    order_index: 0
  }));

  // Clear old profile config
  await supabase.from('skills').delete().eq('category', 'profile_config');
  // Insert new
  await supabase.from('skills').insert(profileEntries);
  console.log('Profile synced.');

  // 2. Sync Competencies
  // Clear old competencies
  await supabase.from('skills').delete().eq('category', 'competency');
  // Insert new
  await supabase.from('skills').insert(resumeData.competencies);
  console.log('Competencies synced.');

  // 3. Sync Experiences
  // Clear old
  await supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  // Insert new
  await supabase.from('experiences').insert(resumeData.experiences);
  console.log('Experiences synced.');

  // 4. Sync Education
  // Clear old
  await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  // Insert new
  await supabase.from('education').insert(resumeData.education);
  console.log('Education synced.');

  console.log('All Resume data synced successfully!');
}

syncResume();
