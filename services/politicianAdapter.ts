// services/politicianAdapter.ts
// ===============================================================
// NOVARIC® Politician Data Adapter
// ===============================================================

import { VipProfile, PoliticianFullDto } from '../types';
import { mapParagonToParagonAnalysis } from '../utils/paragonProfileUtils';

/**
 * Default values for UI presentation
 */
const UI_DEFAULTS = {
    imageUrl: 'https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg',
    category: 'Politikë',
    bio: ''
};

/**
 * Maps a single backend DTO item to the stable UI model.
 * Supports the aggregated response envelope: { politician, overall_score, dimensions, ... }
 */
export function toPoliticianUI(dto: any): VipProfile {
    if (!dto) {
        return {
            id: 'unknown',
            name: 'I paidentifikuar',
            imageUrl: UI_DEFAULTS.imageUrl,
            category: UI_DEFAULTS.category,
            shortBio: UI_DEFAULTS.bio,
            detailedBio: ''
        };
    }

    // 1. Detect if we have an aggregated envelope or a raw profile
    const raw = dto.politician || dto;
    
    if (!raw) {
        return {
            id: 'unknown',
            name: 'I paidentifikuar',
            imageUrl: UI_DEFAULTS.imageUrl,
            category: UI_DEFAULTS.category,
            shortBio: UI_DEFAULTS.bio,
            detailedBio: ''
        };
    }

    const enrichment = dto.profile_enrichment || {};
    
    // 2. Baseline override (none for mock data, strictly use backend/enrichment)
    const baseline: any = null;

    // 3. Construct the PARAGON Score DTO (raw payload for utility)
    const paragonSource = (dto.dimensions || dto.dimensions_json || dto.dimension_scores) ? dto : (raw?.paragon_scores || raw?.paragon || null);
    
    const paragonData = paragonSource ? {
        overall_score: paragonSource.overall_score ?? raw?.overall_score ?? null,
        calculated_at: paragonSource.calculated_at || paragonSource.last_updated || dto.metadata?.last_updated,
        dimension_scores: paragonSource.dimension_scores,
        dimensions_json: paragonSource.dimensions_json,
        dimensions: paragonSource.dimensions
    } : null;

    // 4. Construct the UI Model
    const resolvedPoliticianId = typeof raw?.politicianId === 'number'
      ? raw.politicianId
      : (typeof raw?.politician_id === 'number'
        ? raw.politician_id
        : (typeof raw?.numericId === 'number'
          ? raw.numericId
          : (typeof raw?.id === 'number'
            ? raw.id
            : (typeof dto?.politicianId === 'number'
              ? dto.politicianId
              : (typeof dto?.numericId === 'number'
                ? dto.numericId
                : (typeof raw?.id === 'string' && raw.id.match(/^vip(\d+)$/i)
                  ? parseInt(raw.id.match(/^vip(\d+)$/i)![1], 10)
                  : baseline?.numericId))))));

    return {
        // Identity (Strictly deterministic)
        id: raw?.profile_id || raw?.id || (baseline?.id) || (resolvedPoliticianId != null ? `vip${resolvedPoliticianId}` : 'unknown'),
        numericId: resolvedPoliticianId,
        politicianId: resolvedPoliticianId,
        name: raw?.name || baseline?.name || 'I paidentifikuar',
        
        // Visuals
        imageUrl: raw?.image_url || baseline?.imageUrl || UI_DEFAULTS.imageUrl,
        category: raw?.party ? `Politikë (${raw.party})` : (baseline?.category || raw?.category || UI_DEFAULTS.category),
        
        // Content
        shortBio: raw?.short_bio || baseline?.shortBio || UI_DEFAULTS.bio,
        detailedBio: raw?.detailed_bio || baseline?.detailedBio || "",
        gender: raw?.gender || baseline?.gender,
        zodiacSign: raw?.zodiac_sign || baseline?.zodiacSign,
        age: raw?.age || baseline?.age,
        
        // Dynamic Data (Authoritative Backend - strictly derived from DB, never fabricated)
        paragon: paragonData,
        latestScore: typeof dto.composite === 'number'
          ? dto.composite
          : (typeof dto.dynamicScore === 'number'
            ? dto.dynamicScore
            : (paragonData?.overall_score ?? null)),
        dynamicScore: typeof dto.composite === 'number'
          ? Math.round(dto.composite)
          : (typeof dto.dynamicScore === 'number' ? dto.dynamicScore : null),
        paragonAnalysis: dto.paragonAnalysis || mapParagonToParagonAnalysis(paragonData) || [],
        commentary: dto.commentary || baseline?.commentary,

        // Extended Spec Fields
        party: raw?.party || dto.party || (baseline as any)?.party || null,
        primaryRole: raw?.primary_role || dto.primaryRole || null,
        secondaryRoles: raw?.secondary_roles ? (typeof raw.secondary_roles === 'string' ? JSON.parse(raw.secondary_roles) : raw.secondary_roles) : (dto.secondaryRoles || []),
        parliamentaryStatus: raw?.parliamentary_status || dto.parliamentaryStatus || (raw?.is_active_mp === true || raw?.is_active_mp === 1 ? 'active_mp' : (raw?.is_active_mp === false || raw?.is_active_mp === 0 ? 'not_an_active_mp' : null)),
        detentionStatus: raw?.detention_status || dto.detentionStatus || 'none',
        caseStatus: raw?.case_status || dto.caseStatus || 'none',
        presumptionOfInnocence: raw?.presumption_of_innocence !== undefined ? !!raw.presumption_of_innocence : true,
        legalStatusAsOf: raw?.legal_status_as_of || dto.legalStatusAsOf,
        legalStatusSummary: raw?.legal_status_summary || dto.legalStatusSummary,
        dateOfBirthVerificationStatus: raw?.date_of_birth_verification_status || dto.dateOfBirthVerificationStatus || (raw?.date_of_birth ? 'unverified' : undefined),
        dateOfBirthSourceUrl: raw?.date_of_birth_source_url || dto.dateOfBirthSourceUrl,
        dateOfBirthVerifiedAt: raw?.date_of_birth_verified_at || dto.dateOfBirthVerifiedAt,
        roleHistory: raw?.role_history || dto.roleHistory || [],
        scoringSuspended: dto.scoringSuspended ?? dto.scoring_suspended ?? raw?.scoring_suspended ?? true,
        scoringSuspensionNotice: "Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.",
        composite: typeof dto.composite === 'number'
          ? dto.composite
          : (typeof dto.dynamicScore === 'number' ? dto.dynamicScore : null),
        compositeDelta: typeof dto.compositeDelta === 'number' ? dto.compositeDelta : null,
        periodEnd: dto.periodEnd || dto.period_end || null,
        dimsSource: dto.dimsSource || "db",
        dateOfBirth: dto.dateOfBirth || dto.date_of_birth || raw?.date_of_birth || (baseline as any)?.dateOfBirth || null,
        placeOfBirth: dto.placeOfBirth || dto.place_of_birth || raw?.place_of_birth || (baseline as any)?.placeOfBirth || null,
        electoralZone: dto.electoralZone || dto.electoral_zone || raw?.electoral_zone || (baseline as any)?.electoralZone || null,
        paragonDimensions: Array.isArray(dto.paragonDimensions) && dto.paragonDimensions.length >= 7
          ? dto.paragonDimensions.slice(0, 7).map((d: any) => typeof d === 'number' ? d : null)
          : (dto.composite != null && Array.isArray(dto.paragonAnalysis) && dto.paragonAnalysis.length >= 7
            ? dto.paragonAnalysis.slice(0, 7).map((d: any) => typeof d?.score === 'number' ? d.score : null)
            : null),
        compositeHistory: dto.compositeHistory || (baseline as any)?.compositeHistory || null,
        bio: dto.bio || null,
        recentActivity: Array.isArray(dto.recentActivity) ? dto.recentActivity : [],
        assetDeclaration: dto.assetDeclaration && (dto.assetDeclaration.year || dto.assetDeclaration.categories?.length) ? dto.assetDeclaration : null,
        assetTimeline: Array.isArray(dto.assetTimeline) ? dto.assetTimeline : [],
        mandates: Array.isArray(dto.mandates) ? dto.mandates : [],
        promises: Array.isArray(dto.promises) ? dto.promises : [],
        consistencyFlags: Array.isArray(dto.consistencyFlags) ? dto.consistencyFlags : [],
        votingRecord: Array.isArray(dto.votingRecord) ? dto.votingRecord : [],
        rhetoric: dto.rhetoric || null,
        affiliations: Array.isArray(dto.affiliations) ? dto.affiliations : [],
        evidence: Array.isArray(dto.evidence) ? dto.evidence : [],
        rightOfReply: Array.isArray(dto.rightOfReply) ? dto.rightOfReply : [],
        scoreRevisions: Array.isArray(dto.scoreRevisions) ? dto.scoreRevisions : [],
        dimensionReadings: dto.dimensionReadings && typeof dto.dimensionReadings === 'object' ? dto.dimensionReadings : {},

        // Enrichment Arrays (Authoritative from aggregate, else fallback)
        timelineEvents: (enrichment.timeline && enrichment.timeline.length > 0) 
            ? enrichment.timeline 
            : (baseline?.timelineEvents || []),
            
        documents: (enrichment.documents && enrichment.documents.length > 0)
            ? enrichment.documents
            : (baseline?.documents || []),
            
        speeches: (enrichment.statements && enrichment.statements.length > 0)
            ? enrichment.statements
            : (baseline?.speeches || []),
            
        relatedLinks: (enrichment.media_refs && enrichment.media_refs.length > 0)
            ? enrichment.media_refs
            : (baseline?.relatedLinks || []),

        improvement_checklist: dto.improvement_checklist || [],
        
        publicPerception: raw?.publicPerception || baseline?.publicPerception
    };
}

/**
 * Merges and maps an array of backend items.
 */
export function mergePoliticianCards(liveDtos: any[]): VipProfile[] {
    if (!Array.isArray(liveDtos)) return [];

    return liveDtos
        .filter(d => !!d)
        .map(toPoliticianUI);
}
