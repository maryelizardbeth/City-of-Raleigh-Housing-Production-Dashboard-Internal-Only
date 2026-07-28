/* =============================================================================
 * City of Raleigh — Housing Landscape (V2, single-page map + dashboard)
 * Central configuration
 *
 * V2 changes vs. the arcgis-featurelayer prototype:
 *   - Data now comes from HOSTED FEATURE LAYERS in the Raleigh AGOL org
 *     (org v400IkDOw1ad7Yad), matching the "Housing Production Tracker Map Test"
 *     web map (item f0787de35a2e4f44bb1c717cbc12683e).
 *   - The three resident-level programs are the PUBLIC DE-IDENTIFIED point
 *     layers (names/addresses dropped; geometry displaced 200–700 m) so they
 *     are safe to show on a public map.
 *   - "Other Housing Impact" is a NEW program layer (added to the toggles).
 *   - Dashboard charts read the AGGREGATE SUMMARY TABLE, which is the
 *     SOURCE OF TRUTH. Point layers will NOT sum to it (see notes in the UI).
 *
 * Field names below are the hosted-service names (PascalCase_with_underscores),
 * verified live against each FeatureServer on 2026-07-23.
 * ============================================================================= */

/* --- City of Raleigh brand tokens (source: raleigh-branding skill) --------- */
export const BRAND = {
  raleighGreen: "#0D6937",
  leafGreen:    "#73AB45",
  midGreen:     "#4C8C40",
  chartreuse:   "#A8C23E",
  teal:         "#189ABC",
  navy:         "#01426A",
  amber:        "#FBAE40",
  rust:         "#A8322D",
  bodyText:     "#414042",
  border:       "#BFBFBF",
  lightFill:    "#F2F2F2",
  greenTint:    "#DAEFD3",
  greenTintAlt: "#F3F9EF",
  white:        "#FFFFFF",
};

/* --- AGOL org + source web map --------------------------------------------- */
const ORG = "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services";
// The web map this app mirrors (kept for reference / future item-id loading).
export const WEBMAP_ID = "f0787de35a2e4f44bb1c717cbc12683e";

/* --- Map defaults ---------------------------------------------------------- *
 * The source web map uses the Esri "Community (US Edition)" vector basemap
 * (item 188219e2c8e44fe780c2fd3b3bb021f6). Its style + tiles are PUBLIC and
 * load without an API key, so we build it from `communityStyleUrl` to match the
 * web map exactly. Set basemap:"osm" to fall back to the key-free OSM raster.   */
export const MAP = {
  basemap: "community",   // "community" (matches web map) | "osm"
  communityStyleUrl: "https://www.arcgis.com/sharing/rest/content/items/188219e2c8e44fe780c2fd3b3bb021f6/resources/styles/root.json",
  center: [-78.6382, 35.7796],   // downtown Raleigh
  zoom: 11,
};

/* --- City housing program layers (hosted feature layers) ------------------- *
 * `kind` drives the renderer/popup. The Housing Development layer is the only
 * one with full project detail; the other three are the public de-identified
 * resident-level layers (approximate locations).                               */
export const HOUSING_LAYERS = [
  {
    id: "housing_development",
    title: "City Housing Development",
    url: `${ORG}/Housing_Production_Tracker_Housing_Development_Layer/FeatureServer/9`,
    kind: "dev",
    visible: true,
  },
  {
    id: "homeowner_rehabs",
    title: "Home Repair",
    url: `${ORG}/HomeownerRehabs_Public_De_identified_/FeatureServer/0`,
    kind: "rehab",
    color: BRAND.teal,
    deidentified: true,
    visible: true,
  },
  {
    id: "homebuyer_assistance",
    title: "Homebuyer Assistance",
    url: `${ORG}/HomebuyerAssistance_Public_De_identified_/FeatureServer/0`,
    kind: "hba",
    color: BRAND.navy,
    deidentified: true,
    visible: true,
  },
  {
    id: "other_housing_impact",
    title: "Other Housing Impact",           // NEW program
    url: `${ORG}/OtherHousingImpact_Public_De_identified_/FeatureServer/0`,
    kind: "other",
    color: BRAND.midGreen,
    deidentified: true,
    visible: true,
  },
];

/* Aggregate SUMMARY TABLE — the authoritative source of truth for the
 * dashboard charts (completed units + pipeline by fiscal year / quarter).
 * It is a non-spatial hosted table; charts query it directly.                  */
export const SUMMARY_TABLE = {
  url: `${ORG}/Housing_Production_Tracker_Housing_Production_Tracker/FeatureServer/0`,
  fields: {
    fiscalYear:  "Fiscal_Year",
    endYear:     "End_Year",
    quarter:     "Quarter",
    quarterFY:   "QuarterFY",
    total:       "Total_Complete",
    dateUpdated: "Date_updated",
    hdPipeline:  "Housing_Development_Pipeline",
    hrPipeline:  "Homeowner_Rehab_Pipeline",
  },
  // Completed-unit categories, in stacking order.
  categories: [
    { field: "Housing_Development_New_Construction", label: "New construction",      color: BRAND.raleighGreen },
    { field: "Housing_Development_Preservation",     label: "Preserved",             color: BRAND.leafGreen },
    { field: "Homeowner_Rehabs",                     label: "Home repair",           color: BRAND.chartreuse },
    { field: "Homebuyer_Assistance",                 label: "Homebuyer assistance",  color: BRAND.teal },
    { field: "Other_Housing_Impact",                 label: "Other housing impact",  color: BRAND.amber },
  ],
};

/* Field-name map for the Housing Development layer (map filters + popups). */
export const DEV_FIELDS = {
  project:        "Project",
  developer:      "Developer",
  address:        "Main_Address",
  status:         "Status",
  projectStatus:  "Project_Status",
  fiscalYear:     "Fiscal_Year",
  totalUnits:     "Total_Units",
  homeownership:  "Homeownership_Units",
  population:     "Population",
  construction:   "Construction_Type",
  developmentType:"Development_Type",
  council:        "Council_District",
  ncod:           "OLAY_NAME",
  loanAmount:     "City_of_Raleigh_Loan_Amount",
  coDate:         "CO_Date",
  fundingSource:  "Funding_Source",
  unrestricted:   "Unrestricted_Units",
  amiBands: [
    ["Units_20_pct_AMI", "≤20%", "#01426A"],
    ["Units_30_pct_AMI", "30%",  "#189ABC"],
    ["Units_40_pct_AMI", "40%",  "#4C8C40"],
    ["Units_50_pct_AMI", "50%",  "#73AB45"],
    ["Units_60_pct_AMI", "60%",  "#A8C23E"],
    ["Units_70_pct_AMI", "70%",  "#FBAE40"],
    ["Units_80_pct_AMI", "80%",  "#E07B39"],
  ],
  // Individual funding-amount columns (shown in the popup where > 0).
  fundingAmounts: [
    ["Local",                                  "Local"],
    ["f_2020_Bond",                            "2020 Bond"],
    ["HOME",                                   "HOME"],
    ["Community_Development_Block_Grant_CDBG",  "CDBG"],
    ["Dedicated_Affordable_Housing_Fund_DAHF",  "Dedicated Affordable Housing Fund (DAHF)"],
    ["Other",                                  "Other (CDBG, ERA2, etc.)"],
  ],
};

/* Field-name maps for the de-identified resident-level layers. */
export const REHAB_FIELDS = {
  fiscalYear: "Fiscal_Year", rehabType: "Rehab_Type", totalUnits: "Total_Units",
  ami: "AMI", status: "Status", projectStatus: "Project_Status",
  loanAmount: "City_of_Raleigh_Loan_Amount", fundingSource: "Funding_Source",
  council: "Council_District", ncod: "OLAY_NAME", note: "Note",
  amiBands: ["Units_20_pct_AMI","Units_30_pct_AMI","Units_40_pct_AMI","Units_50_pct_AMI","Units_60_pct_AMI","Units_70_pct_AMI","Units_80_pct_AMI"],
};
export const HBA_FIELDS = {
  fiscalYear: "Fiscal_Year", totalUnits: "Total_Units", ami: "AMI",
  projectStatus: "Project_Status",   // added in the 2026-07 data update
  loanAmount: "City_of_Raleigh_Loan_Amount", fundingSource: "Funding_Source",
  council: "Council_District", ncod: "OLAY_NAME",
  amiBands: ["Units_20_pct_AMI","Units_30_pct_AMI","Units_40_pct_AMI","Units_50_pct_AMI","Units_60_pct_AMI","Units_70_pct_AMI","Units_80_pct_AMI"],
};
export const OTHER_FIELDS = {
  fiscalYear: "Fiscal_Year", totalUnits: "Total_Units", status: "Status",
  projectStatus: "Project_Status", notes: "Notes",
  council: "Council_District", ncod: "OLAY_NAME",
};

/* --- HUD / non-City subsidized housing (unchanged; live HUD services) ------ */
const HUD_BASE = "https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services";
const WAKE = "STATE2KX='37' AND CURCNTY_NM LIKE 'Wake%'";
export const HUD_LAYERS = [
  {
    id: "hud_public_housing",
    title: "Public Housing Developments (incl. RHA)",
    url: `${HUD_BASE}/Public_Housing_Developments/FeatureServer/0`,
    where: WAKE, style: "square", color: "#01426A",
    name: ["PROJECT_NAME", "FORMAL_PARTICIPANT_NAME"], addr: ["STD_ADDR", "STD_CITY"], units: "TOTAL_UNITS",
    extra: [["Housing authority", "FORMAL_PARTICIPANT_NAME"], ["ACC units", "ACC_UNITS"]],
    visible: false,
  },
  {
    id: "hud_mf_assisted",
    title: "Multifamily Assisted (Section 8 / 202 / 811)",
    url: `${HUD_BASE}/Multifamily_Properties_Assisted/FeatureServer/0`,
    where: WAKE, style: "diamond", color: "#189ABC",
    name: ["PROPERTY_NAME_TEXT"], addr: ["ADDRESS_LINE1_TEXT", "PLACED_BASE_CITY_NAME_TEXT"], units: "TOTAL_ASSISTED_UNIT_COUNT",
    extra: [["Total units", "TOTAL_UNIT_COUNT"], ["Category", "PROPERTY_CATEGORY_NAME"], ["Client group", "CLIENT_GROUP_NAME"]],
    visible: false,
  },
  {
    id: "hud_lihtc",
    title: "LIHTC Properties (tax-credit)",
    url: `${HUD_BASE}/LIHTC/FeatureServer/0`,
    where: "PROJ_ST='NC' AND CURCNTY_NM LIKE 'Wake%'", style: "triangle", color: "#FBAE40",
    name: ["PROJECT"], addr: ["PROJ_ADD", "PROJ_CTY"], units: "N_UNITS",
    extra: [["Low-income units", "LI_UNITS"], ["Year placed in service", "YR_PIS"], ["Allocation amt", "ALLOCAMT"]],
    visible: false,
  },
  {
    id: "hud_insured_mf",
    title: "HUD-Insured Multifamily",
    url: `${HUD_BASE}/HUD_Insured_Multifamily_Properties/FeatureServer/0`,
    where: WAKE, style: "x", color: "#A8322D",
    name: ["PROPERTY_NAME_TEXT"], addr: ["ADDRESS_LINE1_TEXT", "PLACED_BASE_CITY_NAME_TEXT"], units: "MAXIMUM_CONTRACT_UNIT_COUNT",
    extra: [["Program", "PROGRAM_TYPE1"], ["Client group", "CLIENT_GROUP_NAME"]],
    visible: false,
  },
];

/* --- Reference / boundary layers (unchanged; live City services) ----------- */
export const REFERENCE_LAYERS = [
  {
    id: "council_districts", title: "City Council Districts", type: "feature",
    url: "https://maps.raleighnc.gov/arcgis/rest/services/Boundaries/MapServer/2",
    kind: "boundary", color: "#01426A", labelField: "COUNCIL_DIST", visible: true,
  },
  {
    id: "ncods", title: "Neighborhood Conservation Overlay Districts (NCODs)", type: "feature",
    url: "https://maps.raleighnc.gov/arcgis/rest/services/Planning/Overlays/MapServer/9",
    kind: "boundary", color: "#189ABC", labelField: "OLAY_NAME", visible: false,
  },
  {
    id: "transit_routes", title: "Transit Routes (GoRaleigh)", type: "feature",
    url: "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/GoRaleigh_Routes/FeatureServer/0",
    kind: "transit", color: "#73AB45", width: 1.5, visible: false,
  },
  {
    id: "brt", title: "Bus Rapid Transit corridors (Wake BRT)", type: "feature",
    url: "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Bus_Rapid_Transit_Corridors/FeatureServer/0",
    kind: "transit", color: "#A8322D", width: 4, labelField: "Name", visible: false,
  },
  {
    id: "market_indicators", title: "Market Supply Indicators (by block group)", type: "feature",
    url: "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/RaleighBlockGroups_2014_2018_AllFields/FeatureServer/0",
    kind: "choropleth", defaultIndicator: "pct_owner_occ",
    indicators: [
      { id: "pct_owner_occ",     label: "% Owner-Occupied",              field: "PercentOwnerOccupied2018", format: "percent"  },
      { id: "pct_renter_occ",    label: "% Renter-Occupied",             field: "PercentRenterOccupied2018", format: "percent" },
      { id: "renter_units",      label: "Renter-Occupied Units (count)", field: "RENTER_CY_1",              format: "number"   },
      { id: "median_hh_income",  label: "Median Household Income",       field: "MEDHINC_CY_1",             format: "currency" },
      { id: "median_home_value", label: "Median Home Value",             field: "MEDVAL_CY_1",              format: "currency" },
      { id: "pct_vacant",        label: "% Vacant Housing Units",        field: null, expr: "IIf($feature.TOTHU_CY_1>0, $feature.VACANT_CY_1/$feature.TOTHU_CY_1*100, null)", format: "percent" },
      { id: "median_rent",       label: "Median Gross Rent (needs ACS layer)",       field: null, format: "currency" },
      { id: "pct_owner_cb",      label: "% Owners Cost-Burdened (needs ACS layer)",  field: null, format: "percent"  },
      { id: "pct_renter_cb",     label: "% Renters Cost-Burdened (needs ACS layer)", field: null, format: "percent"  },
    ],
    ramp: ["#F3F9EF", "#DAEFD3", "#A8C23E", "#73AB45", "#4C8C40", "#0D6937"],
    visible: false,
  },
];
