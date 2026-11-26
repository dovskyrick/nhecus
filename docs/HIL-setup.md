# HIL — things only you can click

Tick them off in order. Each subtopic is exactly 34 words. Tell Claude whenever a step hands back a value (config, UID).

## 1. [ ] Turn on GitHub Pages
Open the nhecus repo, then Settings → Pages → Build and deployment → Source: "GitHub Actions". Next, Actions tab → "Deploy website to GitHub Pages" → Run workflow. The public mock-up appears at dovskyrick.github.io/nhecus.

## 2. [ ] Create the Firebase project
Firebase console → Add project → name it "nhecus". Google Analytics is unnecessary. Keep it separate from the dovsky project, so ink and oil data never mix. Blaze plan is required for Storage buckets.

## 3. [x] Register the web app
Project settings → General → Your apps → Web (</>). Name it "nhecus-web" and skip Firebase Hosting. Copy the firebaseConfig object and paste it to Claude; web configs are public by design, not secret.

## 4. [ ] Create Firestore and Storage
Build → Firestore Database → Create, in production mode, region europe-west1 (Belgium). Then Build → Storage → Get started, same region. In Billing, set a budget alert around five euros for peace of mind.

## 5. [x] Enable the admin login
Authentication → Sign-in method → Email/Password → Enable, leaving passwordless off. Then Users → Add user with your email and a strong password from a password manager. Never write the email into this repo.

## 6. [x] Send Claude your UID
Authentication → Users → copy the long User UID of your own account. Claude replaces REPLACE-WITH-ADMIN-UID in firestore.rules and storage.rules. UIDs are only identifiers, so they are safe inside this public repository, unlike emails.

## 7. [x] Publish the security rules
After Claude commits your UID, paste website/firestore.rules into Firestore → Rules → Publish, and website/storage.rules into Storage → Rules → Publish. Without this step, saving anything from the back-office fails with confusing permission-denied errors.

## 8. [ ] Authorize the Pages domain
Authentication → Settings → Authorized domains → Add domain: dovskyrick.github.io. Later also add nhecus.com. Otherwise the back-office login fails with an "unauthorized domain" error. Localhost should already be listed there by default, for testing.

## 9. [ ] Set your contact details
Back-office → About & contact → enter your email and Instagram handle (no @), then save. The Instagram handle appears under the "Ask about it" form as "or message on Instagram ↗". The email is shown on the About page.

## 9b. [ ] Connect the "Ask about it" form (Formspree)
Use the same Formspree form as dovsky.com. Copy its ID: the code after /f/ in its endpoint, e.g. abcdwxyz. In this repo go to Settings → Secrets and variables → Actions → Variables. Add VITE_FORMSPREE_ID with that ID, then re-run the Pages deploy. If the form restricts allowed domains in Formspree, add dovskyrick.github.io (and nhecus.com later). Each message carries site: nhecus.

## 10. [ ] Smoke-test the back-office
Open dovskyrick.github.io/nhecus/admin, sign in, create collections, then add one drawing with a cropped photo. Star it for the Show. Reload the public site in a browser: your drawing appears and the "mock-up" badge disappears.

## 11. [x] Pick a favourite theme
Paper won. The theme picker is gone; Night wall and Zine are frozen in website/src/theme/archive, with a short README file explaining how to revive either one later, should you ever want fresh variations again.

## 12. [ ] Point nhecus.com here (later)
In Namecheap Advanced DNS, add GitHub Pages A records and a www CNAME to dovskyrick.github.io. Then repo Settings → Pages → Custom domain: nhecus.com, tick enforce HTTPS, and set repository variable BASE_PATH to "/".

## 13. [ ] Renew the domain before 2030
Three Google Calendar reminders were created for May, August and October 2029. Check the exact expiry date inside Namecheap, enable auto-renew if you like, and confirm the saved payment card is still valid there.
