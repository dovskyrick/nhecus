# HIL — connect nhecus.com (Namecheap → GitHub Pages)

No Firebase deploy needed: GitHub Pages keeps hosting the site. Each step is exactly 23 words.

## 1. [ ] Firebase?
No Firebase Hosting is needed. GitHub Pages keeps serving the site; Firebase stays only for drawings, login and images. Nothing to deploy there.

## 2. [ ] Namecheap DNS
Namecheap, open Domain List, Manage, Advanced DNS: delete the parking records, then add four A records for host @: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.

## 3. [ ] www record
Still in Advanced DNS, add a CNAME record: host www, value dovskyrick.github.io. Save everything, then wait up to an hour for DNS propagation.

## 4. [ ] GitHub custom domain
In the nhecus repo: Settings, Pages, Custom domain, type nhecus.com, Save. Wait for the green DNS check to pass, then tick Enforce HTTPS.

## 5. [ ] Base path
Settings, Secrets and variables, Actions, Variables tab: add BASE_PATH with value / so all links work at the domain root instead of /nhecus/.

## 6. [ ] Redeploy
Actions tab, Deploy website to GitHub Pages, Run workflow. After about a minute or two, nhecus.com serves the site and nhecus.com/admin the back-office.

## 7. [ ] Firebase login domain
Open Firebase console, Authentication, Settings, Authorized domains: add both nhecus.com and www.nhecus.com, otherwise the back-office sign-in fails with an unauthorized domain error message.

## 8. [ ] Protect the domain
Optional but wise against takeovers: GitHub profile Settings, Pages, Add a verified domain, nhecus.com, then add the TXT record GitHub shows into Namecheap.

---
Steps 5 and 6 go together: once the domain is on, the site must be rebuilt for the root address, or images and the admin page break.
When nhecus.com loads, ask Claude to switch the repo links and docs to the new address.
