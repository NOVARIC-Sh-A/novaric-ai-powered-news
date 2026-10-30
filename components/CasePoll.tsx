
import React, { useState, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import { getApiEndpoint } from '../services/apiConfig';

const POLL_ID = 'shkreli_beci_poll';

const fetchVotes = async (
    setVotes: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
    try {
        const response = await fetch(`${getApiEndpoint('/poll-vote')}?pollId=${POLL_ID}`);
        if (!response.ok) {
            // For 404, it just means no votes yet, which is fine. The backend will create it on first vote.
            if (response.status === 404) {
                 setVotes({ shkreli: 0, beci: 0, unsure: 0 });
                 return;
            }
            throw new Error(`Server responded with status ${response.status}`);
        }
        // FIX: Explicitly type the JSON response to prevent state from becoming 'any'.
        const data: { [key: string]: number } = await response.json();
        setVotes(data);
    } catch (error) {
        console.error("Failed to fetch poll votes:", error);
        setError("Nuk u mundësua ngarkimi i votave. Provoni përsëri më vonë.");
    }
};

export const CasePoll: React.FC = () => {
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [votes, setVotes] = useState<{ [key: string]: number }>({ shkreli: 0, beci: 0, unsure: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userVote = localStorage.getItem(POLL_ID);
    if (userVote) {
      setVotedOption(userVote);
    }
    fetchVotes(setVotes, setError).finally(() => setIsLoading(false));
  }, []);

  // Poll for new votes every 15 seconds if user hasn't voted
  useInterval(() => {
    if (!votedOption) {
       fetchVotes(setVotes, setError);
    }
  }, 15000);

  const handleVote = async (option: string) => {
    if (votedOption) return;

    // Immediately update UI for responsiveness
    // FIX: Add explicit Number conversion and cast votes to any to ensure arithmetic operations are valid.
    const optimisticVotes = { ...votes, [option]: (Number((votes as any)[option]) || 0) + 1 };
    setVotes(optimisticVotes);
    setVotedOption(option); // Set voted option immediately for UI feedback
    localStorage.setItem(POLL_ID, option);
    
    try {
      const response = await fetch(getApiEndpoint('/poll-vote'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: POLL_ID, option: option })
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      // FIX: Explicitly type the JSON response to prevent state from becoming 'any'.
      const updatedVotes: { [key: string]: number } = await response.json();
      setVotes(updatedVotes); // Sync with the authoritative server state

    } catch (error) {
      console.error("Failed to submit vote:", error);
      setError("Vota juaj nuk u regjistrua. Ju lutemi provoni përsëri.");
      // Revert optimistic update on failure
      setVotedOption(null);
      localStorage.removeItem(POLL_ID);
      fetchVotes(setVotes, setError) // Re-fetch to get correct state
    }
  };

  // FIX: Cast Object.values to number[] to ensure totalVotes is inferred as a number and resolves comparison/arithmetic errors.
  const totalVotes = (Object.values(votes) as number[]).reduce((sum: number, count: number) => sum + Number(count), 0);
  // FIX: Cast Object.values to any[] before map to handle unknown type issues.
  const winningVoteCount = totalVotes > 0 ? Math.max(...(Object.values(votes) as any[]).map(v => Number(v))) : 0;

  const options = [
    { id: 'shkreli', label: 'Simon SHKRELI' },
    { id: 'beci', label: 'Benet BECI' },
    { id: 'unsure', label: 'Nuk jam i sigurt' }
  ];

  if (isLoading) {
      return <div className="text-center p-4">Duke ngarkuar sondazhin...</div>;
  }
  
  if (error) {
       return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-200 mb-4">Sondazh: Cili mendoni se ka të drejtë në këtë rast?</h3>
      <div className="space-y-3">
        {options.map(option => {
          // FIX: Add explicit Number conversion and cast to any to ensure arithmetic operations are valid.
          const voteCount = Number((votes as any)[option.id] || 0);
          const isWinner = voteCount > 0 && voteCount === winningVoteCount;
          
          return (
            <div key={option.id}>
              {!votedOption ? (
                <button
                  onClick={() => handleVote(option.id)}
                  className="w-full text-left p-3 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-700/50 transition-colors font-semibold"
                >
                  {option.label}
                </button>
              ) : (
                <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                   <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${isWinner ? 'bg-red-400 dark:bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    style={{ width: `${totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : '0.0'}%` }}
                  ></div>
                  <div className="relative flex justify-between items-center p-3">
                    <span className={`font-bold ${isWinner ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {option.label}
                    </span>
                    <span className={`text-sm font-semibold ${isWinner ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : '0.0'}% ({voteCount} vota)
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
       <div className="text-center mt-4">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Vota: {totalVotes.toLocaleString()}</p>
        {votedOption && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ju keni votuar.</p>}
       </div>
    </div>
  );
};
