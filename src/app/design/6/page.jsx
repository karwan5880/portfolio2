'use client'

import { CareerPlanSection } from '../../../components/portfolio/6/CareerPlanSection'
import { EducationSection } from '../../../components/portfolio/6/EducationSection'
import { LandingSection } from '../../../components/portfolio/6/LandingSection'
import { LinksSection } from '../../../components/portfolio/6/LinksSection'
import { ProjectsSection } from '../../../components/portfolio/6/ProjectsSection'
import { SkillsSection } from '../../../components/portfolio/6/SkillsSection'
import { TimelineSection } from '../../../components/portfolio/6/TimelineSection'

import { DesignFooter } from '@/components/design/DesignFooter'

export default function Design6Page() {
  return (
    <div className="overflow-x-hidden">
      <LandingSection />
      <EducationSection />
      <TimelineSection />
      <SkillsSection />
      <CareerPlanSection />
      <ProjectsSection />
      <LinksSection />
      <DesignFooter />
    </div>
  )
}
