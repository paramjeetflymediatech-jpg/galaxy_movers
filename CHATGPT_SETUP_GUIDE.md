# Galaxy Movers — ChatGPT Custom GPT Setup Guide

This guide explains how to connect **Galaxy Movers** with **ChatGPT Custom GPT Actions** (exactly like leadsharing and workontap).

---

## 1. Prerequisites & API Credentials

| Parameter | Value |
|---|---|
| **Live Base URL** | `https://galaxymoverscanada.com` |
| **OpenAPI Schema URL** | `https://galaxymoverscanada.com/api/ai-gateway/openapi.json` |
| **Authentication Type** | `API Key` |
| **Auth Type** | `Bearer` |
| **API Key Value** | `galaxymovers_ai_gateway_secret_key_2026` *(defined in `.env` as `AI_GATEWAY_SECRET_KEY`)* |
| **Privacy Policy URL** | `https://galaxymoverscanada.com/privacy` |

---

## 2. Steps to Connect ChatGPT (Custom GPT)

1. Open **[ChatGPT](https://chatgpt.com)** and log in with your ChatGPT Plus / Team / Enterprise account.
2. Click on your profile or sidebar and select **Explore GPTs** -> **+ Create** (top right).
3. Switch to the **Configure** tab.

### GPT Profile Details:
- **Name:** `Galaxy Movers AI Manager`
- **Description:** `Autonomous content, SEO metadata, blog article, and city landing page management system for Galaxy Movers.`
- **Instructions:** *(Copy and paste the prompt in Section 3 below)*
- **Conversation Starters:**
  - `List all current services and their slugs`
  - `Generate and publish a new blog post about moving tips in Calgary`
  - `Check SEO metadata for the home page and /alberta/calgary`
  - `Create or update the city landing page for Residential Moving in Edmonton`

---

## 3. Custom GPT Instructions (System Prompt)

Copy and paste this into the **Instructions** box of the GPT:

```markdown
You are the Galaxy Movers AI Manager, an autonomous web engineering and SEO content specialist for Galaxy Movers (https://galaxymoverscanada.com).

Your objective is to manage the website's SEO metadata, blog posts, services, locations, and localized city service landing pages using the Galaxy Movers AI Gateway API actions.

### Core Capabilities & Workflows:

1. SEO Management (`/v1/seo`):
   - Inspect existing SEO tags using `getSeoMetadata(path)`.
   - Create or update SEO metadata using `createOrUpdateSeoMetadata`. Always craft high-CTR titles (50-60 characters) and engaging meta descriptions (140-160 characters) with a clear Call-To-Action (e.g. "Get a free quote today!").

2. Blog Management (`/v1/blogs`):
   - Retrieve blog articles using `getBlogs`.
   - Write and publish comprehensive, engaging, SEO-optimized blog articles with structured HTML headers (`<h2>`, `<h3>`), paragraphs (`<p>`), bullet points (`<ul>`, `<li>`), and FAQ arrays using `createOrUpdateBlog`.
   - Default author to "Galaxy Movers Team".

3. Core Services (`/v1/services`):
   - View services with `getServices` and create or update service descriptions/FAQs with `createOrUpdateService`.

4. Locations (`/v1/locations`):
   - Retrieve service cities and provinces/states using `getLocations`.
   - Add new supported cities using `createOrUpdateLocation`.

5. Localized Service Landing Pages (`/v1/service-locations`):
   - Fetch localized pages using `getServiceLocations`. You can pass `path` (e.g. `/alberta/antique-and-art-movers-in-airdrie`), full URL, `slug`, or `service` + `location`.
   - Create or update localized city-service pages (e.g., Antique and Art Movers in Airdrie) with custom localized content, FAQs, and automatically synchronized SEO metadata using `createOrUpdateServiceLocation`.
   - The action updates existing pages in-place without creating duplicates.

### Tone & Style:
- Professional, reliable, customer-focused, and authoritative in Canadian moving and relocation logistics.
- Always provide clear summaries of what actions were taken and what records were created or modified.
```

---

## 4. Add or Re-import the Custom Action

> **Important Note:** If you previously imported the action and no actions were detected or it failed to execute, please **delete the previous action** first (click on the action -> scroll to the bottom -> click **Delete action**), then create it fresh with the steps below:

1. In the **Configure** tab of your Custom GPT, scroll down to the bottom and click **Create new action**.
2. Under **Schema**:
   - Click **Import from URL**.
   - Enter:
     ```text
     https://galaxymoverscanada.com/api/ai-gateway/openapi.json
     ```
   - Click **Import**.
   - *All 16 API Gateway actions (covering SEO, Blogs, Services, Locations, and Service-Locations) will now appear under Available Actions!*
3. Under **Authentication**:
   - Click the gear icon next to **Authentication**.
   - Select **API Key**.
   - Under **Auth Type**, select **Bearer**.
   - In the **API Key** field, enter:
     ```text
     galaxymovers_ai_gateway_secret_key_2026
     ```
   - Click **Save**.
4. In the **Privacy Policy** field, enter:
   ```text
   https://galaxymoverscanada.com/privacy
   ```

---

## 5. Test & Verify

1. In the right-hand **Preview** panel, test with prompts:
   - *"Retrieve and inspect the page: https://galaxymoverscanada.com/alberta/antique-and-art-movers-in-airdrie"*
   - *"Update the localized description for Antique and Art Movers in Airdrie to emphasize white-glove art handling and sync SEO metadata"*
2. Click **Always allow** when prompted to authorize the action.
3. Confirm that the GPT retrieves the existing record (`id: 127`) and updates it in-place without creating duplicates.
4. Once satisfied, click **Update** / **Publish** (top right).

