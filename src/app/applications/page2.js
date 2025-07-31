'use client'

import { useEffect, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { applications } from '@/data/applications2'
import { useGatekeeper } from '@/hooks/useGatekeeper'

// Filter and clean the applications data
const cleanApplications = applications.filter((app) => app.name && app.name.trim() !== '')

// Calculate stats
const totalApplications = cleanApplications.length
const interviewCount = cleanApplications.filter((app) => app.status === 'interviewed').length
const appliedCount = cleanApplications.filter((app) => app.status === 'applied').length
const interviewRate = Math.round((interviewCount / totalApplications) * 100)

// Geographic distribution
const getRegion = (companyName) => {
  const asianCompanies = [
    'ByteDance',
    'Tencent',
    'Shopee',
    'TSMC',
    'Confinex Technologi',
    '華碩電腦股份有限公司',
    'Manpower Services (Hong Kong) Limited',
    'HK Express',
    'The University of Hong Kong',
    'Hong Kong Metropolitan University',
    '緯穎科技服務股份有限公司',
    'HKT Enterprise Solutions',
    'MediaTek',
    'Hong Kong Science & Technology Parks Corporation',
    'Canonical 英商科能有限公司台灣分公司',
    '大立光電股份有限公司',
    '沐恩生醫光電股份有限公司',
    'Inventec 英業達股份有限公司',
    '和碩集團 和碩聯合科技股份有限公司',
    '睿控網安股份有限公司',
    '聯詠科技股份有限公司',
    '筑波科技股份有限公司',
    '圖策科技股份有限公司',
    '全球儀器科技股份有限公司',
    '聯發科技集團 達發科技股份有限公司',
    '馬來西亞商思想科技有限公司台灣分公司',
    '友達數位科技服務股份有限公司',
    '威旭資訊股份有限公司',
    '牧德科技股份有限公司',
    '梭特科技股份有限公司',
    '叡揚資訊股份有限公司',
    '台驊國際控股股份有限公司',
    '華晶科技股份有限公司',
    '由田新技股份有限公司',
    '玩構網路科技有限公司',
    '安霸股份有限公司',
    '偲倢科技股份有限公司',
    '博訊生物科技股份有限公司',
    '竹陞科技股份有限公司',
    '千逢科技股份有限公司',
    '鴻華國際科技股份有限公司',
    '耐思尼股份有限公司',
    '聯和科創股份有限公司',
    '凌陽科技股份有限公司',
    '方俊工程有限公司',
    '數碼虛擬人科技有限公司',
    '鉅怡智慧股份有限公司',
    '訊連科技股份有限公司',
    'Cathay Pacific',
    'City University of Hong Kong',
    'Laboratory of Data Discovery for Health Limited',
    'ESDlife',
    'ASMPT',
    'theOrigo Limited',
    'DAINVI Limited',
    '凱衛資訊股份有限公司',
    '通泰克科技股份有限公司',
    'China Mobile Hong Kong Company Limited',
    'Eunodata 御諾資訊股份有限公司',
    '興創知能股份有限公司',
    'Maistorage',
    'Cathay Pacific Group Careers',
    'Huawei Hong Kong Research Center (HKRC)',
    '皓展資訊股份有限公司',
    'Mercdes-Benz Malaysia',
    'Singtel Group',
  ]

  const usCompanies = ['Google', 'Meta', 'Apple', 'Amazon', 'Netflix', 'Microsoft', 'Nvidia', 'Tesla', 'OpenAI', 'Stripe', 'Airbnb', 'LinkedIn', 'Twitter', 'Uber', 'Lyft', 'Texas Instruments', 'Micron', 'Broadcom']

  if (asianCompanies.some((asian) => companyName.includes(asian) || asian.includes(companyName))) return 'Asia-Pacific'
  if (usCompanies.includes(companyName)) return 'North America'
  return 'Other'
}

const regionData = cleanApplications.reduce((acc, app) => {
  const region = getRegion(app.name)
  acc[region] = (acc[region] || 0) + 1
  return acc
}, {})

// Company categories
const techGiants = ['Google', 'Meta', 'Apple', 'Amazon', 'Netflix', 'Microsoft', 'Nvidia', 'Tesla', 'OpenAI']
const techGiantApps = cleanApplications.filter((app) => techGiants.includes(app.name))

// Status breakdown
const statusData = [
  { status: 'Applied', count: appliedCount, percentage: Math.round((appliedCount / totalApplications) * 100) },
  { status: 'Interviewed', count: interviewCount, percentage: Math.round((interviewCount / totalApplications) * 100) },
]

export default function ApplicationsDashboard() {
  useGatekeeper('/applications')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const filteredApplications = cleanApplications.filter((app) => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'interviewed') return app.status === 'interviewed'
    if (selectedFilter === 'applied') return app.status === 'applied'
    if (selectedFilter === 'tech-giants') return techGiants.includes(app.name)
    if (selectedFilter === 'asia') return getRegion(app.name) === 'Asia-Pacific'
    if (selectedFilter === 'us') return getRegion(app.name) === 'North America'
    return true
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'status') return b.status.localeCompare(a.status)
    return 0
  })

  return (
    <div className={styles.dashboardWrapper}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Job Applications Dashboard</h1>
        <p className={styles.dashboardSubtitle}>Comprehensive analysis of job hunt progress</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{totalApplications}</div>
          <div className={styles.metricLabel}>Total Applications</div>
          <div className={styles.metricTrend}>📈 Active campaign</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{interviewCount}</div>
          <div className={styles.metricLabel}>Interviews Secured</div>
          <div className={styles.metricTrend}>🎯 {interviewRate}% success rate</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{Object.keys(regionData).length}</div>
          <div className={styles.metricLabel}>Regions Targeted</div>
          <div className={styles.metricTrend}>🌍 Global reach</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{techGiantApps.length}</div>
          <div className={styles.metricLabel}>Tech Giants</div>
          <div className={styles.metricTrend}>🏢 FAANG+ focused</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        {/* Status Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Application Status</h3>
          <div className={styles.statusChart}>
            {statusData.map((item, index) => (
              <div key={index} className={styles.statusBar}>
                <div className={styles.statusLabel}>
                  <span>{item.status}</span>
                  <span className={styles.statusCount}>{item.count}</span>
                </div>
                <div className={styles.statusBarContainer}>
                  <div className={`${styles.statusBarFill} ${item.status === 'Interviewed' ? styles.interviewed : styles.applied}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
                <span className={styles.statusPercentage}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Geographic Distribution</h3>
          <div className={styles.geoChart}>
            {Object.entries(regionData).map(([region, count], index) => (
              <div key={index} className={styles.geoItem}>
                <div className={styles.geoLabel}>
                  <span className={styles.geoIcon}>{region === 'Asia-Pacific' ? '🌏' : region === 'North America' ? '🇺🇸' : '🌍'}</span>
                  <span>{region}</span>
                </div>
                <div className={styles.geoCount}>{count}</div>
                <div className={styles.geoBar}>
                  <div className={styles.geoBarFill} style={{ width: `${(count / totalApplications) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Filter by:</label>
          <select className={styles.filterSelect} value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
            <option value="all">All Applications ({totalApplications})</option>
            <option value="interviewed">Interviewed ({interviewCount})</option>
            <option value="applied">Applied ({appliedCount})</option>
            <option value="tech-giants">Tech Giants ({techGiantApps.length})</option>
            <option value="asia">Asia-Pacific ({regionData['Asia-Pacific'] || 0})</option>
            <option value="us">North America ({regionData['North America'] || 0})</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sort by:</label>
          <select className={styles.filterSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Company Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className={styles.applicationsSection}>
        <h3 className={styles.sectionTitle}>Applications ({filteredApplications.length})</h3>
        <div className={styles.applicationsList}>
          {sortedApplications.map((app, index) => (
            <div key={index} className={`${styles.applicationCard} ${styles[app.status]}`}>
              <div className={styles.companyName}>{app.name}</div>
              <div className={styles.applicationStatus}>
                <span className={`${styles.statusBadge} ${styles[app.status]}`}>{app.status === 'interviewed' ? '🎯 Interviewed' : '📤 Applied'}</span>
              </div>
              <div className={styles.companyRegion}>{getRegion(app.name)}</div>
            </div>
          ))}
        </div>
      </div>

      <CornerLink href="/job-hunt" position="bottom-left" label="Job Hunt" aria-label="Return to job-hunt" />
      <CornerLink href="/location" position="bottom-right" label="World" aria-label="Go to location" />
    </div>
  )
}
