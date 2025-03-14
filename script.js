// Global data variable
let csvData = [];

// Function to populate dropdowns with unique values
function populateDropdowns() {
  const workloads = [...new Set(csvData.map(row => row.WorkloadType))];
  const levels = [...new Set(csvData.map(row => row.SecurityLevel))];
  const providers = [...new Set(csvData.map(row => row.CloudProvider))];
  
  document.getElementById("workload").innerHTML = '<option value="">-- Select Workload Type --</option>' +
    workloads.map(w => `<option>${w}</option>`).join('');
  document.getElementById("security").innerHTML = '<option value="">-- Select Security Level --</option>' +
    levels.map(s => `<option>${s}</option>`).join('');
  document.getElementById("provider").innerHTML = '<option value="">-- Select Cloud Provider --</option>' +
    providers.map(p => `<option>${p}</option>`).join('');
}

// Function to determine badge class based on certification text
function getBadgeClass(cert) {
  if (cert.toLowerCase().includes('low')) return 'low';
  if (cert.toLowerCase().includes('moderate')) return 'moderate';
  if (cert.toLowerCase().includes('high') || 
      cert.toLowerCase().includes('hipaa') || 
      cert.toLowerCase().includes('il4') || 
      cert.toLowerCase().includes('il5') || 
      cert.toLowerCase().includes('il6')) return 'high';
  return '';
}

// Main function to find certification based on selections
function findCert() {
  const workload = document.getElementById("workload").value;
  const security = document.getElementById("security").value;
  const provider = document.getElementById("provider").value;
  
  if (!workload || !security || !provider) {
    alert("Please select all three criteria to generate compliance requirements.");
    return;
  }
  
  const match = csvData.find(row =>
    row.WorkloadType === workload &&
    row.SecurityLevel === security &&
    row.CloudProvider === provider
  );
  
  const resultDiv = document.getElementById("result");
  const resultContent = document.getElementById("result-content");
  
  if (match) {
    resultDiv.style.display = "block";
    
    // Process certifications
    const certs = match.RequiredCertifications.split(';').map(cert => {
      const cls = getBadgeClass(cert.trim());
      return `<span class="badge ${cls}">${cert.trim()}</span>`;
    }).join(' ');
    
    // Process tech stack
    const stackItems = match.TechStackRecommendation.split('+').map(item => 
      `<li>${item.trim()}</li>`
    ).join('');
    
    const stack = `
      <div class="stack-section">
        <h3>Recommended ${provider} Compliant Architecture</h3>
        <ul class="stack-list">
          ${stackItems}
        </ul>
      </div>
    `;
    
    const link = `<a href="${match.CSPWebsite}" target="_blank" class="csp-link">View ${provider}'s Government Cloud Documentation →</a>`;
    
    resultContent.innerHTML = `
      <div>
        <h3>Required Certifications</h3>
        <div>${certs}</div>
      </div>
      ${stack}
      ${link}
    `;
  } else {
    resultDiv.style.display = "block";
    resultContent.innerHTML = "No matching configuration found. Please try different selections or contact your compliance officer for custom guidance.";
  }
}

// Function to attempt to load CSV data with fallback to sample data
async function loadData() {
  try {
    // First try to fetch CSV file from the same directory
    const response = await fetch('data.csv');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }
    
    const fileContent = await response.text();
    
    // Parse CSV content
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        if (results.data && results.data.length > 0) {
          console.log("Successfully loaded CSV data");
          csvData = results.data.filter(row => row.WorkloadType && row.SecurityLevel && row.CloudProvider);
          populateDropdowns();
        } else {
          throw new Error("CSV parsing resulted in empty data");
        }
      },
      error: function(error) {
        throw new Error(`CSV parsing error: ${error}`);
      }
    });
  } catch (error) {
    console.log("Using sample data instead: " + error.message);
    // Fallback to hardcoded sample data if CSV loading fails
    csvData = [
      {
        "WorkloadType": "Unclassified Web App",
        "SecurityLevel": "Low",
        "CloudProvider": "AWS",
        "RequiredCertifications": "FedRAMP Low",
        "TechStackRecommendation": "AWS GovCloud + S3 (Object Lock) + EC2 + IAM + CloudTrail",
        "CSPWebsite": "https://aws.amazon.com/govcloud-us/"
      },
      {
        "WorkloadType": "Unclassified Web App",
        "SecurityLevel": "Low",
        "CloudProvider": "Azure",
        "RequiredCertifications": "FedRAMP Low",
        "TechStackRecommendation": "Azure Gov + Blob Storage + App Service + Azure Policy + Monitor",
        "CSPWebsite": "https://azure.microsoft.com/en-us/solutions/government/"
      },
      {
        "WorkloadType": "Unclassified Web App",
        "SecurityLevel": "Low",
        "CloudProvider": "GCP",
        "RequiredCertifications": "FedRAMP Low",
        "TechStackRecommendation": "GCP Assured Workloads + Cloud Storage + Cloud Run + IAM + Shield",
        "CSPWebsite": "https://cloud.google.com/assured-workloads"
      },
      {
        "WorkloadType": "Unclassified Web App",
        "SecurityLevel": "Moderate",
        "CloudProvider": "AWS",
        "RequiredCertifications": "FedRAMP Moderate",
        "TechStackRecommendation": "AWS GovCloud + S3 (Object Lock) + EC2 + IAM + CloudTrail + AWS Config + GuardDuty",
        "CSPWebsite": "https://aws.amazon.com/govcloud-us/"
      },
      {
        "WorkloadType": "Unclassified Web App",
        "SecurityLevel": "Moderate",
        "CloudProvider": "Azure",
        "RequiredCertifications": "FedRAMP Moderate",
        "TechStackRecommendation": "Azure Gov + Blob Storage + App Service + Azure Policy + Sentinel + Defender",
        "CSPWebsite": "https://azure.microsoft.com/en-us/solutions/government/"
      },
      {
        "WorkloadType": "Unclassified Web App",
        "SecurityLevel": "Moderate",
        "CloudProvider": "GCP",
        "RequiredCertifications": "FedRAMP Moderate",
        "TechStackRecommendation": "GCP Assured Workloads + Cloud Storage + Cloud Run + IAM + Shield + Security Command Center",
        "CSPWebsite": "https://cloud.google.com/assured-workloads"
      },
      {
        "WorkloadType": "Mission System",
        "SecurityLevel": "High",
        "CloudProvider": "AWS",
        "RequiredCertifications": "FedRAMP High; DoD SRG IL5",
        "TechStackRecommendation": "AWS GovCloud + S3 (WORM) + EBS Encryption + EC2 Dedicated + VPC Endpoints + AWS Shield Advanced + AWS CloudHSM",
        "CSPWebsite": "https://aws.amazon.com/compliance/dod/"
      },
      {
        "WorkloadType": "Mission System",
        "SecurityLevel": "High",
        "CloudProvider": "Azure",
        "RequiredCertifications": "FedRAMP High; DoD SRG IL5",
        "TechStackRecommendation": "Azure Gov + Storage (WORM) + Dedicated Host + VNet Integration + ExpressRoute + Azure Key Vault + Azure DDOS Protection",
        "CSPWebsite": "https://azure.microsoft.com/en-us/solutions/government/"
      },
      {
        "WorkloadType": "Healthcare Records Platform",
        "SecurityLevel": "High",
        "CloudProvider": "AWS",
        "RequiredCertifications": "FedRAMP High; HIPAA",
        "TechStackRecommendation": "AWS GovCloud + S3 (WORM) + EBS Encryption + EC2 Dedicated + VPC Endpoints + AWS Shield Advanced + AWS CloudHSM + AWS Backup",
        "CSPWebsite": "https://aws.amazon.com/compliance/hipaa-compliance/"
      },
      {
        "WorkloadType": "Healthcare Records Platform",
        "SecurityLevel": "High",
        "CloudProvider": "Azure",
        "RequiredCertifications": "FedRAMP High; HIPAA",
        "TechStackRecommendation": "Azure Gov + Storage (WORM) + Dedicated Host + VNet Integration + ExpressRoute + Azure Key Vault + Azure DDOS Protection + Azure Backup",
        "CSPWebsite": "https://azure.microsoft.com/en-us/solutions/government/"
      },
      {
        "WorkloadType": "Data Analytics Platform",
        "SecurityLevel": "Moderate",
        "CloudProvider": "AWS",
        "RequiredCertifications": "FedRAMP Moderate",
        "TechStackRecommendation": "AWS GovCloud + EMR + Glue + Athena + QuickSight + KMS + VPC Endpoints",
        "CSPWebsite": "https://aws.amazon.com/govcloud-us/"
      },
      {
        "WorkloadType": "Data Analytics Platform",
        "SecurityLevel": "Moderate",
        "CloudProvider": "Azure",
        "RequiredCertifications": "FedRAMP Moderate",
        "TechStackRecommendation": "Azure Gov + Synapse Analytics + Data Factory + Power BI + Key Vault + VNet Service Endpoints",
        "CSPWebsite": "https://azure.microsoft.com/en-us/solutions/government/"
      },
      {
        "WorkloadType": "Data Analytics Platform",
        "SecurityLevel": "Moderate",
        "CloudProvider": "GCP",
        "RequiredCertifications": "FedRAMP Moderate",
        "TechStackRecommendation": "GCP Assured Workloads + BigQuery + Dataflow + Looker + Cloud KMS + VPC Service Controls",
        "CSPWebsite": "https://cloud.google.com/assured-workloads"
      },
      {
        "WorkloadType": "Document Management System",
        "SecurityLevel": "Low",
        "CloudProvider": "AWS",
        "RequiredCertifications": "FedRAMP Low",
        "TechStackRecommendation": "AWS GovCloud + S3 + Lambda + DynamoDB + Cognito + CloudFront",
        "CSPWebsite": "https://aws.amazon.com/govcloud-us/"
      },
      {
        "WorkloadType": "Document Management System",
        "SecurityLevel": "Low",
        "CloudProvider": "Azure",
        "RequiredCertifications": "FedRAMP Low",
        "TechStackRecommendation": "Azure Gov + Blob Storage + Functions + Cosmos DB + B2C + CDN",
        "CSPWebsite": "https://azure.microsoft.com/en-us/solutions/government/"
      },
      {
        "WorkloadType": "Document Management System",
        "SecurityLevel": "Low",
        "CloudProvider": "GCP",
        "RequiredCertifications": "FedRAMP Low",
        "TechStackRecommendation": "GCP Assured Workloads + Cloud Storage + Cloud Functions + Firestore + Identity Platform + Cloud CDN",
        "CSPWebsite": "https://cloud.google.com/assured-workloads"
      }
    ];
    populateDropdowns();
  }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', loadData);