import React, { useState, useEffect } from 'react';

// This is the standalone component for the custom mix form, now with dark-mode styling.
const CustomMixForm = () => {
  const priceMap = {
    '': 0, '30 Minutes': 10, '1 Hour': 20, '1.5 Hours': 25,
    '2 Hours': 30, '2.5 Hours': 35, '3 Hours': 40
  };
  const initialFormState = { name: '', email: '', businessType: 'Restaurant' };
  const initialSetsState = [{ genre: 'Deep House', length: '' }];

  const [formData, setFormData] = useState(initialFormState);
  const [sets, setSets] = useState(initialSetsState);
  const [numSetsInputValue, setNumSetsInputValue] = useState('1');
  const [songRequests, setSongRequests] = useState('');
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
      const newTotal = sets.reduce((acc, currentSet) => acc + (priceMap[currentSet.length] || 0), 0);
      setTotalPrice(newTotal);
  }, [sets]);

  const handleSetCountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
        setNumSetsInputValue(value);
        const count = parseInt(value, 10);
        if (!isNaN(count) && count > 0 && count <= 10) {
            const newSets = Array.from({ length: count }, (_, i) => sets[i] || { genre: 'Deep House', length: '' });
            setSets(newSets);
        } else if (value === '') {
            setSets([]);
        }
    }
  };

  const handleSetChange = (index, field, value) => {
      const newSets = [...sets];
      newSets[index][field] = value;
      setSets(newSets);
  };
  
  const resetForm = () => {
      setFormData(initialFormState);
      setSets(initialSetsState);
      setNumSetsInputValue('1');
      setSongRequests('');
      setNotes('');
      setSubmissionStatus(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    
    const setsDetails = sets.map((set, i) => `Set ${i+1}: ${set.length} of ${set.genre} ($${priceMap[set.length]})`).join('\n');
    const fullMessage = `
      Business Type: ${formData.businessType}\n
      Number of Sets: ${sets.length}\n
      Estimated Total: $${totalPrice}\n
      --- Sets Details ---\n
      ${setsDetails}\n
      --- Song Requests ---\n
      ${songRequests || 'None'}\n
      --- Additional Notes ---\n
      ${notes || 'None'}
    `;

    const formspreeData = {
      name: formData.name, email: formData.email, message: fullMessage,
      _subject: `New Custom Mix Request from ${formData.name} - $${totalPrice}`,
      _replyto: formData.email,
    };

    try {
      const response = await fetch('https://formspree.io/f/xdkzwaaq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formspreeData)
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else { throw new Error('Form submission failed'); }
    } catch (error) {
      console.error('Custom mix form submission error:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <section id="custom-mix" className="container mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-4">Order Your Custom Mix</h1>
      <p className="text-lg md:text-xl text-text max-w-3xl mx-auto mb-10 text-center">Perfect for restaurants, retail, or events. Get curated music sets tailored to your brand's atmosphere.</p>
      
      { submissionStatus === 'success' ? (
          <div className="text-center bg-zinc-900 p-8 rounded-lg">
              <h4 className="text-3xl font-bold text-primary mb-4">Request Sent!</h4>
              <p className="text-lg text-text mb-6">Thank you! Your request has been sent. We'll email you the payment method by mail (50% down payment, 50% on delivery).</p>
              <button type="button" onClick={resetForm} className="bg-accent hover:opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg">
                Make Another Request
              </button>
          </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          <fieldset className="border border-zinc-700 rounded-lg p-6">
            <legend className="px-2 text-lg font-semibold text-primary">Step 1: Your Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full p-4 rounded-lg bg-zinc-900 text-text placeholder-gray-500 border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent" />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full p-4 rounded-lg bg-zinc-900 text-text placeholder-gray-500 border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
             <div className="mt-6">
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-400 mb-2">Business Type / Occasion</label>
              <select name="businessType" id="businessType" value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} className="w-full p-4 rounded-lg bg-zinc-900 text-text border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent">
                <option>Restaurant</option><option>Retail Store</option><option>Coffee Shop</option><option>Bar / Lounge</option><option>Event</option><option>Other</option>
              </select>
            </div>
          </fieldset>

          <fieldset className="border border-zinc-700 rounded-lg p-6">
             <legend className="px-2 text-lg font-semibold text-primary">Step 2: Mix Details</legend>
             <div className="mb-6">
                <label htmlFor="numSets" className="block text-sm font-medium text-gray-400 mb-2">How many sets do you need?</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" name="numSets" id="numSets" maxLength="2" value={numSetsInputValue} onChange={handleSetCountChange} required className="w-full md:w-1/2 p-4 rounded-lg bg-zinc-900 text-text border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
            <div className="space-y-4">
              {sets.map((set, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-zinc-900 p-4 rounded-lg">
                   <span className="font-bold text-text text-center md:text-left">Set {index + 1}</span>
                   <div className="md:col-span-1">
                      <label htmlFor={`genre-${index}`} className="block text-xs font-medium text-gray-500 mb-1">Genre</label>
                      <select id={`genre-${index}`} value={set.genre} onChange={(e) => handleSetChange(index, 'genre', e.target.value)} className="w-full p-2 rounded-lg bg-zinc-800 text-text border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent">
                         <option>Deep House</option><option>Afro House</option><option>Chillout / Downtempo</option><option>Funky House / Disco</option><option>Top 40 / Pop</option><option>R&B / Hip-Hop</option><option>Custom</option>
                      </select>
                   </div>
                   <div className="md:col-span-1">
                      <label htmlFor={`length-${index}`} className="block text-xs font-medium text-gray-500 mb-1">Length</label>
                      <select id={`length-${index}`} value={set.length} onChange={(e) => handleSetChange(index, 'length', e.target.value)} required className="w-full p-2 rounded-lg bg-zinc-800 text-text border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent">
                        <option value="" disabled>-- Select Length --</option>
                        <option>30 Minutes</option><option>1 Hour</option><option>1.5 Hours</option><option>2 Hours</option><option>2.5 Hours</option><option>3 Hours</option>
                      </select>
                   </div>
                   <div className="text-center font-bold text-lg text-accent md:col-span-1">
                      <span>${priceMap[set.length] || 0}</span>
                   </div>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="border border-zinc-700 rounded-lg p-6">
            <legend className="px-2 text-lg font-semibold text-primary">Step 3: Customization</legend>
            <div className="mb-6">
              <label htmlFor="songRequests" className="block text-sm font-medium text-gray-400 mb-2">Specific song requests (optional, one per line)</label>
              <textarea name="songRequests" id="songRequests" placeholder="e.g., Artist - Song Title" rows="5" value={songRequests} onChange={(e) => setSongRequests(e.target.value)} className="w-full p-4 rounded-lg bg-zinc-900 text-text placeholder-gray-500 border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent resize-y"></textarea>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-2">Additional notes or vibe description</label>
              <textarea name="notes" id="notes" placeholder="e.g., 'Upbeat but not intense, for a Sunday brunch vibe.'" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-4 rounded-lg bg-zinc-900 text-text placeholder-gray-500 border border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent resize-y"></textarea>
            </div>
          </fieldset>

          <div className="text-center pt-4">
              <div className="text-2xl font-bold text-text mb-4">
                  Estimated Total: <span className="text-accent">${totalPrice}</span>
              </div>
            <p className="text-sm text-gray-500 mb-4 px-2"><strong>Next Step:</strong> After submitting, we'll email you the payment method. Mixes are delivered via a private Google Drive link.</p>
            <button type="submit" disabled={submissionStatus === 'submitting'} className="bg-accent hover:opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg disabled:opacity-50">
              {submissionStatus === 'submitting' ? 'Submitting Request...' : 'Get My Quote'}
            </button>
            {submissionStatus === 'error' && <p className="text-red-400 mt-4 text-lg">Something went wrong. Please try again or use the general contact form.</p>}
          </div>
        </form>
      )}
    </section>
  );
};

export default CustomMixForm;