# Federal Certification Navigator

A streamlined tool to help federal CTOs and IT decision-makers quickly determine the appropriate cloud certifications and compliant technical stacks based on specific workload requirements.

## Overview

The Federal Certification Navigator is designed for federal partners and agencies looking to migrate workloads to commercial cloud environments while maintaining compliance with federal security standards.

Live demo: [https://flourcode.github.io/federal-cert-navigator/](https://flourcode.github.io/federal-cert-navigator/)

## Features

- Quick selection of workload type, security level, and cloud provider
- Visual indicators for different certification levels (Low, Moderate, High)
- Recommended compliant technology stack for each scenario
- Direct links to cloud service provider government documentation
- Mobile-responsive design for on-the-go access

## Implementation

This is a pure HTML/CSS/JavaScript implementation with no server-side dependencies, making it easy to deploy on GitHub Pages or any static hosting service.

## File Structure

- `index.html` - Main application HTML
- `styles.css` - Application styling
- `script.js` - JavaScript functionality
- `data.csv` - Certification and recommendation data

## Development

The tool was initially built as a quick reference guide and has been optimized for federal CTOs and decision-makers. It uses modern CSS Grid and Flexbox layouts for responsive design.

## Data Sources

The certification requirements and technology stack recommendations are based on:
- FedRAMP certification requirements
- DoD Cloud Computing SRG
- NIST 800-53 controls
- CSP-specific government compliance documentation

## Deployment

To deploy this project on GitHub Pages:

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. Set the source to the main branch

Or simply download the files and host them on any web server.

## Contributing

Feel free to submit pull requests with additional cloud providers, workload types, or updated certification requirements.

## License

This project is available under the MIT License.