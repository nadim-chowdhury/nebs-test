# NEBS Test Project

## Technical Requirements & Progress

### Front-end (Next.js/React)

- [ ] **UI Implementation**

  - [ ] Convert Figma/UI references into fully responsive components

- [ ] **Create Notice Form**

  - [ ] Implement proper validation for required fields
  - [ ] Implement "Notice Type" as a dropdown
  - [ ] **Form Submission**
    - [ ] Persist data into database
    - [ ] Display "Notice Published Successfully" popup

- [ ] **Notice Listing Page**
  - [ ] Fetch data from backend API
  - [ ] Display notices in a table
  - [ ] Implement Publish/Unpublish status toggle
  - [ ] Implement Pagination

### Backend (NestJS / Node.js)

- [ ] **API Endpoints**

  - [ ] Create a notice
  - [ ] Get all notices (with active/draft filtering)
  - [ ] Update notice status (publish/unpublished)
  - [ ] View a single notice

- [ ] **Database (PostgreSQL + Drizzle)**
  - [ ] Store notice data
