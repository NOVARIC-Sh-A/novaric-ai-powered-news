import React, { useState, useCallback } from 'react';
import { DeconstructedArticle, HighlightedSegment } from '../types';
import { deconstructArticle, isHermeneuticServiceMisconfigured } from '../services/hermeneuticService';
import { CpuChipIcon, ExclamationTriangleIcon, LightBulbIcon } from './icons';

const getCategoryStyles = (category: HighlightedSegment['category']): string => {
    switch (category) {
        case 'Kornizim Kulturor':
            return 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-b-2 border-blue-400';
        case 'Mbrojtje e Burimit':
            return 'bg-purple-100 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 border-b-2 border-purple-400';
        case 'Gjuhë Emocionale':
            return 'bg-yellow-100 dark:bg-yellow-700/50 text-yellow-800 dark:text-yellow-200 border-b-2 border-yellow-500';
        case 'Arketip Narrativ':
            return 'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 border-b-2 border-green-400';
        default:
            return 'bg-slate-200 dark:bg-slate-600';
    }
};

const LoadingState: React.FC = () => (
    <div className="text-center py-10">
        <CpuChipIcon className="w-12 h-12 text-primary-500 mx-auto animate-pulse" />
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Duke analizuar tekstin...</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Ky proces mund të zgjasë disa sekonda.</p>
    </div>
);

const ResultsDisplay: React.FC<{ result: DeconstructedArticle }> = ({ result }) => {
    const [activeSegment, setActiveSegment] = useState<HighlightedSegment | null>(null);

    const renderTextWithHighlights = () => {
        let lastIndex = 0;
        const elements = [];
        const sortedSegments = [...result.segments].sort((a, b) => result.analyzedText.indexOf(a.text) - result.analyzedText.indexOf(b.text));

        sortedSegments.forEach((segment, i) => {
            const index = result.analyzedText.indexOf(segment.text, lastIndex);
            if (index > lastIndex) {
                elements.push(<span key={`text-${lastIndex}`}>{result.analyzedText.substring(lastIndex, index)}</span>);
            }
            elements.push(
                <span
                    key={`segment-${i}`}
                    className={`${getCategoryStyles(segment.category)} rounded-sm px-1 cursor-pointer`}
                    onClick={() => setActiveSegment(segment)}
                >
                    {segment.text}
                </span>
            );
            lastIndex = index + segment.text.length;
        });

        if (lastIndex < result.analyzedText.length) {
            elements.push(<span key={`text-last`}>{result.analyzedText.substring(lastIndex)}</span>);
        }
        return elements;
    };

    return (
        <div className="mt-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-6">Rezultatet e Analizës</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold mb-2">Teksti i Analizuar</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Klikoni mbi fjalët e nënvizuara për të parë shpjegimin.</p>
                    <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-justify">
                        {renderTextWithHighlights()}
                    </div>
                </div>
                <div className="md:col-span-1">
                    {activeSegment ? (
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg sticky top-24">
                            <h4 className={`font-bold text-lg mb-2 ${getCategoryStyles(activeSegment.category).split(' ')[1]}`}>{activeSegment.category}</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{activeSegment.explanation}</p>
                        </div>
                    ) : (
                        <div className="p-4 text-center bg-slate-100 dark:bg-slate-700/50 rounded-lg sticky top-24">
                            <LightBulbIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">Zgjidhni një segment të nënvizuar për të parë detajet e analizës këtu.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const DeconstructNewsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DeconstructedArticle | null>(null);
    const isMisconfigured = isHermeneuticServiceMisconfigured();

    const handleAnalysis = useCallback(async () => {
        if (isMisconfigured) {
            setError("Shërbimi i analizës nuk është konfiguruar siç duhet.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await deconstructArticle(text);
            setResult(analysisResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ndodhi një gabim i panjohur.");
        } finally {
            setIsLoading(false);
        }
    }, [text, isMisconfigured]);

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2" style={{ textShadow: '2px 2px #4f46e5, 4px 4px #1a1a1a' }}>Dekonstrukto Lajmin</h1>
                    <p className="text-lg font-semibold text-white mt-2" style={{ textShadow: '1px 1px 2px #4f46e5, 2px 2px #1a1a1a' }}>
                        Zbuloni narrativat e fshehura dhe kornizimet kulturore në tekstet gazetareske.
                    </p>
                </header>

                <div className="bg-white dark:bg-slate-800/80 p-6 rounded-lg shadow-xl">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={12}
                        className="w-full p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="Ngjisni tekstin e plotë të artikullit këtu për një analizë të thelluar hermeneutike..."
                        disabled={isLoading || isMisconfigured}
                    />
                    <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button
                            onClick={handleAnalysis}
                            disabled={isLoading || !text.trim() || isMisconfigured}
                            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 font-semibold rounded-lg shadow-md transition-all bg-primary-600 hover:bg-primary-700 text-white disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            <CpuChipIcon className="w-5 h-5 mr-2" />
                            Analizo me IA
                        </button>
                         <button onClick={onBack} className="text-sm text-slate-600 dark:text-slate-400 hover:underline">
                           Kthehu Pas
                        </button>
                    </div>

                    {isMisconfigured && (
                         <p className="text-center text-red-500 mt-4 flex items-center justify-center gap-2"><ExclamationTriangleIcon className="w-5 h-5" /> Shërbimi i analizës nuk është konfiguruar.</p>
                    )}

                    {error && (
                         <p className="text-center text-red-500 mt-4">{error}</p>
                    )}
                </div>

                {isLoading && <LoadingState />}
                {result && <ResultsDisplay result={result} />}

            </div>
             <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                  animation: fadeIn 0.5s ease-out forwards;
                }
              `}</style>
        </main>
    );
};
