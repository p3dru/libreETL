import re

with open('src/app/learn/page.tsx', 'r') as f:
    content = f.read()

# Update transforms array
old_transforms = """  const transforms = [
    { key: 'dropnulls' }, { key: 'fillnulls' }, { key: 'dropdupes' },
    { key: 'case' }, { key: 'trim' }, { key: 'rename' }, { key: 'filter' },
  ];"""

new_transforms = """  const transforms = [
    { key: 'dropnulls' }, { key: 'fillnulls' }, { key: 'dropdupes' },
    { key: 'case' }, { key: 'trim' }, { key: 'rename' }, { key: 'filter' },
    { key: 'removecol' }, { key: 'converttype' }, { key: 'sort' },
    { key: 'calc' }, { key: 'mask' }, { key: 'groupby' }, { key: 'fuzzy' }
  ];"""

content = content.replace(old_transforms, new_transforms)

# Update sections array
old_sections = """    { id: 'history', label: t('learn.nav.history') },
    { id: 'export', label: t('learn.nav.export') },
  ];"""

new_sections = """    { id: 'history', label: t('learn.nav.history') },
    { id: 'export', label: t('learn.nav.export') },
    { id: 'wipecache', label: t('learn.nav.wipecache') },
  ];"""

content = content.replace(old_sections, new_sections)

# Add wipecache section at the end
wipe_cache_html = """
        {/* WIPE CACHE */}
        <section id="wipecache" style={{ scrollMarginTop: '110px' }}>
          <Heading2 icon={<AlertCircle size={22} />} color="var(--error)">{t('learn.wipecache.title')}</Heading2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem' }}>{t('learn.wipecache.intro')}</p>
          <InfoBox title={t('learn.wipecache.title')} color="var(--error)">{t('learn.wipecache.desc')}</InfoBox>
        </section>
      </main>
"""

content = content.replace("      </main>", wipe_cache_html)

# Add AlertCircle import
content = content.replace("import { BookOpen, UploadCloud, Activity, Layout, Save, Download, Zap, Code as CodeIcon, GitMerge } from 'lucide-react';", "import { BookOpen, UploadCloud, Activity, Layout, Save, Download, Zap, Code as CodeIcon, GitMerge, AlertCircle } from 'lucide-react';")


with open('src/app/learn/page.tsx', 'w') as f:
    f.write(content)

print("Patched learn/page.tsx")
