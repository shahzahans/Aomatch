// Invoice Mode — 8 extracted fields
export const invoiceFields = [
  {
    id: 'total-amount',
    fieldLabel: 'TOTAL AMOUNT',
    sourceSentence: 'Total Amount Due: $12,450.00 must be paid by December 31, 2026',
    extractedValue: '$12,450.00',
    matchedText: '$12,450.00',
    page: 2,
    confidence: 98,
  },
  {
    id: 'invoice-date',
    fieldLabel: 'INVOICE DATE',
    sourceSentence: 'Invoice Date: March 15, 2026',
    extractedValue: '2026-03-15',
    matchedText: 'March 15, 2026',
    page: 1,
    confidence: 99,
  },
  {
    id: 'customer-name',
    fieldLabel: 'CUSTOMER NAME',
    sourceSentence: 'Bill To: Acme Corporation, 123 Business Ave, San Francisco, CA 94102',
    extractedValue: 'Acme Corporation',
    matchedText: 'Acme Corporation',
    page: 1,
    confidence: 97,
  },
  {
    id: 'invoice-number',
    fieldLabel: 'INVOICE NUMBER',
    sourceSentence: 'Invoice Number: INV-2026-0342',
    extractedValue: 'INV-2026-0342',
    matchedText: 'INV-2026-0342',
    page: 1,
    confidence: 99,
  },
  {
    id: 'payment-terms',
    fieldLabel: 'PAYMENT TERMS',
    sourceSentence: 'Payment Terms: Net 30 days from invoice date',
    extractedValue: 'Net 30',
    matchedText: 'Net 30',
    page: 2,
    confidence: 95,
  },
  {
    id: 'vendor-tax-id',
    fieldLabel: 'VENDOR TAX ID',
    sourceSentence: 'Vendor: TechSupply Inc., Tax ID: 94-1234567',
    extractedValue: '94-1234567',
    matchedText: '94-1234567',
    page: 1,
    confidence: 99,
  },
  {
    id: 'shipping-address',
    fieldLabel: 'SHIPPING ADDRESS',
    sourceSentence: 'Shipping Address: 456 Commerce Street, Austin, TX 78701',
    extractedValue: '456 Commerce Street, Austin, TX 78701',
    matchedText: '456 Commerce Street, Austin, TX 78701',
    page: 2,
    confidence: 96,
  },
  {
    id: 'po-number',
    fieldLabel: 'PO NUMBER',
    sourceSentence: 'Purchase Order: PO-2026-789',
    extractedValue: 'PO-2026-789',
    matchedText: 'PO-2026-789',
    page: 2,
    confidence: 99,
  },
];

// Grant / Compliance Mode — 8 extracted fields
export const grantFields = [
  {
    id: 'grant-title',
    fieldLabel: 'GRANT TITLE',
    sourceSentence: 'GENERAL TERMS AND CONDITIONS FOR DOE SBIR AND STTR PHASE I AND PHASE II GRANTS',
    extractedValue: 'GENERAL TERMS AND CONDITIONS FOR DOE SBIR AND STTR PHASE I AND PHASE II GRANTS',
    matchedText: 'GENERAL TERMS AND CONDITIONS FOR DOE SBIR AND STTR PHASE I AND PHASE II GRANTS',
    page: 1,
    confidence: 99,
  },
  {
    id: 'grantor-name',
    fieldLabel: 'GRANTOR NAME',
    sourceSentence: 'U.S. Department of Energy',
    extractedValue: 'U.S. Department of Energy',
    matchedText: 'U.S. Department of Energy',
    page: 1,
    confidence: 99,
  },
  {
    id: 'audit-threshold',
    fieldLabel: 'AUDIT THRESHOLD',
    sourceSentence: 'Recipients that expend $750,000.00 or more in a year under DOE awards are subject to the audit requirements',
    extractedValue: '$750,000.00',
    matchedText: '$750,000.00',
    page: 2,
    confidence: 97,
  },
  {
    id: 'pre-award-cost-window',
    fieldLabel: 'PRE-AWARD COST WINDOW',
    sourceSentence: 'Recipients may incur pre-award costs up to ninety (90) calendar days prior to the effective date of an award',
    extractedValue: '90 calendar days',
    matchedText: 'ninety (90) calendar days',
    page: 2,
    confidence: 94,
  },
  {
    id: 'extension-notice-window',
    fieldLabel: 'EXTENSION NOTICE WINDOW',
    sourceSentence: 'Recipient requests for extensions of time on the grant must be submitted for approval at least ten (10) calendar days prior',
    extractedValue: '10 calendar days',
    matchedText: 'ten (10) calendar days',
    page: 2,
    confidence: 93,
  },
  {
    id: 'phase-i-threshold',
    fieldLabel: 'PHASE I THRESHOLD',
    sourceSentence: 'If this award is less than or equal to $250,000.00, then this is a fixed amount award',
    extractedValue: '$250,000.00',
    matchedText: '$250,000.00',
    page: 13,
    confidence: 96,
  },
  {
    id: 'fast-track-timing',
    fieldLabel: 'FAST-TRACK TIMING',
    sourceSentence: 'Recipient submitting a continuation application 60 days prior to the end of Phase I',
    extractedValue: '60 days prior to end of Phase I',
    matchedText: '60 days prior',
    page: 13,
    confidence: 91,
  },
  {
    id: 'document-type',
    fieldLabel: 'DOCUMENT TYPE',
    sourceSentence: 'This PDF looks like a terms/compliance document, not a normal grant notice',
    extractedValue: 'Terms / Compliance Document',
    matchedText: 'terms/compliance document',
    page: 1,
    confidence: 88,
  },
];

// ─── Invoice Document Pages ───────────────────────────────────────────────────
export const invoiceDocPages = [
  {
    pageNumber: 1,
    blocks: [
      { type: 'company-name', text: 'TechSupply Inc.' },
      { type: 'company-detail', text: '123 Technology Drive, San Jose, CA 95110' },
      { type: 'company-detail', text: 'billing@techsupply.com  ·  (408) 555-0142' },
      { type: 'company-detail', text: 'www.techsupply.com' },
      { type: 'divider' },
      { type: 'section-label', text: 'INVOICE' },
      { type: 'spacer' },
      { type: 'mixed-para', parts: [
        { text: 'Invoice Number: ' },
        { text: 'INV-2026-0342', fieldId: 'invoice-number' },
      ]},
      { type: 'mixed-para', parts: [
        { text: 'Invoice Date: ' },
        { text: 'March 15, 2026', fieldId: 'invoice-date' },
      ]},
      { type: 'mixed-para', parts: [{ text: 'Due Date: April 14, 2026' }] },
      { type: 'spacer' },
      { type: 'section-label', text: 'BILL TO' },
      { type: 'mixed-para', parts: [
        { text: 'Bill To: ' },
        { text: 'Acme Corporation', fieldId: 'customer-name' },
        { text: ', 123 Business Ave, San Francisco, CA 94102' },
      ]},
      { type: 'spacer' },
      { type: 'section-label', text: 'VENDOR DETAILS' },
      { type: 'mixed-para', parts: [
        { text: 'Vendor: TechSupply Inc., Tax ID: ' },
        { text: '94-1234567', fieldId: 'vendor-tax-id' },
      ]},
    ],
  },
  {
    pageNumber: 2,
    blocks: [
      { type: 'section-label', text: 'PAYMENT DETAILS' },
      { type: 'mixed-para', parts: [
        { text: 'Payment Terms: ' },
        { text: 'Net 30', fieldId: 'payment-terms' },
        { text: ' days from invoice date' },
      ]},
      { type: 'mixed-para', parts: [
        { text: 'Purchase Order: ' },
        { text: 'PO-2026-789', fieldId: 'po-number' },
      ]},
      { type: 'spacer' },
      { type: 'section-label', text: 'LINE ITEMS' },
      { type: 'items-table', items: [
        { description: 'Enterprise Software License (Annual)', qty: '1', unit: 'ea', amount: '$10,000.00' },
        { description: 'Implementation & Onboarding Services', qty: '5', unit: 'hr', amount: '$2,450.00' },
      ]},
      { type: 'spacer' },
      { type: 'section-label', text: 'DELIVERY' },
      { type: 'mixed-para', parts: [
        { text: 'Shipping Address: ' },
        { text: '456 Commerce Street, Austin, TX 78701', fieldId: 'shipping-address' },
      ]},
      { type: 'divider' },
      { type: 'total-line', parts: [
        { text: 'Total Amount Due: ' },
        { text: '$12,450.00', fieldId: 'total-amount' },
        { text: ' must be paid by December 31, 2026' },
      ]},
    ],
  },
];

// ─── Grant / Compliance Document Pages ──────────────────────────────────────
export const grantDocPages = [
  {
    pageNumber: 1,
    blocks: [
      { type: 'gov-header', text: 'U.S. DEPARTMENT OF ENERGY' },
      { type: 'gov-header', text: 'OFFICE OF SCIENCE' },
      { type: 'spacer' },
      { type: 'doc-title', parts: [
        { text: 'GENERAL TERMS AND CONDITIONS FOR DOE SBIR AND STTR PHASE I AND PHASE II GRANTS', fieldId: 'grant-title' },
      ]},
      { type: 'spacer' },
      { type: 'agency', parts: [
        { text: 'U.S. Department of Energy', fieldId: 'grantor-name' },
      ]},
      { type: 'company-detail', text: 'Office of Science · Washington, DC 20585' },
      { type: 'divider' },
      { type: 'section-label', text: 'DOCUMENT NOTICE' },
      { type: 'note-block', parts: [
        { text: 'Document Classification: This PDF looks like a ' },
        { text: 'terms/compliance document', fieldId: 'document-type' },
        { text: ', not a normal grant notice. The following terms and conditions apply to all DOE SBIR/STTR Phase I and Phase II awards.' },
      ]},
      { type: 'spacer' },
      { type: 'section-label', text: 'ARTICLE 1. DEFINITIONS' },
      { type: 'mixed-para', parts: [
        { text: 'For the purposes of these terms and conditions, "award" means a grant or cooperative agreement; "recipient" means the organization receiving the award; and "DOE" means the U.S. Department of Energy.' },
      ]},
    ],
  },
  {
    pageNumber: 2,
    blocks: [
      { type: 'article-header', text: 'ARTICLE 2. AUDIT REQUIREMENTS' },
      { type: 'mixed-para', parts: [
        { text: 'Recipients that expend ' },
        { text: '$750,000.00', fieldId: 'audit-threshold' },
        { text: ' or more in a year under DOE awards are subject to the audit requirements contained in 2 CFR Part 200 Subpart F. The recipient must obtain a single or program-specific audit for that year.' },
      ]},
      { type: 'spacer' },
      { type: 'article-header', text: 'ARTICLE 3. PRE-AWARD COSTS' },
      { type: 'mixed-para', parts: [
        { text: 'Recipients may incur pre-award costs up to ' },
        { text: 'ninety (90) calendar days', fieldId: 'pre-award-cost-window' },
        { text: ' prior to the effective date of an award without prior DOE approval, provided that the costs are necessary and would otherwise be allowable.' },
      ]},
      { type: 'spacer' },
      { type: 'article-header', text: 'ARTICLE 4. TIME EXTENSIONS' },
      { type: 'mixed-para', parts: [
        { text: 'Recipient requests for extensions of time on the grant must be submitted for approval at least ' },
        { text: 'ten (10) calendar days', fieldId: 'extension-notice-window' },
        { text: ' prior to the end of the period of performance. Extensions require written justification.' },
      ]},
      { type: 'spacer' },
      { type: 'article-header', text: 'ARTICLE 5. PROGRAM INCOME' },
      { type: 'mixed-para', parts: [
        { text: 'Program income earned during the project period shall be retained by the recipient and used in accordance with the cost sharing or matching requirements of the award.' },
      ]},
    ],
  },
  {
    pageNumber: 13,
    blocks: [
      { type: 'article-header', text: 'ARTICLE 32. FIXED AMOUNT AWARDS' },
      { type: 'mixed-para', parts: [
        { text: 'If this award is less than or equal to ' },
        { text: '$250,000.00', fieldId: 'phase-i-threshold' },
        { text: ', then this is a fixed amount award under which payment is made on the basis of a predetermined fixed amount without requiring the submittal of a financial report unless the recipient requests an extension.' },
      ]},
      { type: 'spacer' },
      { type: 'article-header', text: 'ARTICLE 33. FAST-TRACK PROVISIONS' },
      { type: 'mixed-para', parts: [
        { text: 'Recipient submitting a continuation application ' },
        { text: '60 days prior', fieldId: 'fast-track-timing' },
        { text: ' to the end of Phase I may be eligible for expedited review under the fast-track procedures. Phase II work must be directly related to Phase I technical results.' },
      ]},
      { type: 'spacer' },
      { type: 'article-header', text: 'ARTICLE 34. FINAL REPORTING' },
      { type: 'mixed-para', parts: [
        { text: 'All final technical reports, financial reports, and invention disclosures must be submitted within 120 calendar days after the end of the period of performance.' },
      ]},
    ],
  },
];
