import os
from jinja2 import Environment, FileSystemLoader
from ..models.schemas import FeasibilityReport

TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def render_report_html(report: FeasibilityReport) -> str:
    """Renders executive dossier into print-ready HTML with embedded CSS."""
    template = env.get_template("report_template.html")
    return template.render(report=report)

def generate_pdf_bytes(report: FeasibilityReport) -> bytes:
    """
    Generates PDF bytes using WeasyPrint if available,
    otherwise returns the UTF-8 HTML bytes suitable for direct browser rendering and window.print().
    """
    html_content = render_report_html(report)
    try:
        from weasyprint import HTML
        return HTML(string=html_content).write_pdf()
    except Exception:
        # Fallback to UTF-8 encoded printable HTML
        return html_content.encode("utf-8")
