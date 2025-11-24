import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Send, Clock, Users, MessageSquare, AlertCircle, CheckCircle2, Loader2, Smile, MessageCircle, X } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    rawNumbers: '', // Added for multi-number input
    dialCode: '91', // Default to India
    receiverNumbers: '',
    totalMessages: 1,
    delay: 2,
    message: ''
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onEmojiClick = (emojiObject) => {
    setFormData(prev => ({ ...prev, message: prev.message + emojiObject.emoji }));
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setStatus({ type: 'error', message: 'Message sending cancelled by user' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Parse phone numbers from raw input
    const numbers = (formData.rawNumbers || '')
      .split(',')
      .map(num => num.trim())
      .filter(num => num.length > 0);

    if (numbers.length === 0) {
      setStatus({ type: 'error', message: 'Please enter at least one phone number' });
      return;
    }

    // Format numbers with country code
    const formattedNumbers = numbers.map(num => {
      // If number starts with +, assume it has country code
      if (num.startsWith('+')) return num;
      // Otherwise prepend selected dial code
      return `+${formData.dialCode}${num}`;
    });

    setLoading(true);

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const hostname = window.location.hostname;
      const response = await fetch(`http://${hostname}:3001/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverNumbers: formattedNumbers.join(','), // Match backend expectation
          totalMessages: parseInt(formData.totalMessages), // Match backend expectation
          delay: parseInt(formData.delay),
          message: formData.message
        }),
        signal: abortControllerRef.current.signal
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Messages queued successfully!' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send messages.' });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatus({ type: 'error', message: 'Message sending cancelled' });
      } else {
        setStatus({ type: 'error', message: 'Network error. Ensure backend is running.' });
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-4 font-sans bg-[#e5ddd5]">
      {/* Main Container - Full width on mobile, max-width on desktop */}
      <div className="w-full md:max-w-4xl bg-white md:rounded-lg shadow-xl flex flex-col md:flex-row h-screen md:h-[600px]">

        {/* Left Side - Info / Branding (Hidden on small mobile screens, visible on md+) */}
        <div className="hidden md:flex bg-[#008069] p-8 text-white md:w-1/3 flex-col justify-between relative md:rounded-l-lg overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-8 h-8" />
              <h1 className="text-2xl font-bold tracking-tight">WhatsSend</h1>
            </div>
            <p className="text-emerald-100 mb-8">
              Automate your WhatsApp messaging workflow efficiently and securely.
            </p>

            <div className="space-y-4 text-sm text-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Bulk Messaging</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Smart Delays</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Delivery Status</span>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden bg-[#008069] p-4 text-white flex items-center gap-3 shadow-md z-10">
          <MessageCircle className="w-6 h-6" />
          <h1 className="text-xl font-bold">WhatsSend</h1>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 bg-[#f0f2f5] relative flex flex-col h-full md:rounded-r-lg overflow-y-auto">
          {/* Chat Header Look */}
          <div className="bg-[#f0f2f5] p-3 md:p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 text-sm md:text-base">New Broadcast</h2>
                <p className="text-xs text-gray-500">Enter details below</p>
              </div>
            </div>
          </div>

          {/* Form Content - Scrollable area */}
          <div className="flex-1 p-4 md:p-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-5">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto pb-20 md:pb-0">

              {/* Numbers Input with Inline Country Selector */}
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
                <label className="block text-xs font-bold text-[#008069] uppercase mb-2">
                  Receiver Numbers
                </label>

                {/* Custom Wrapper for Country Selector + Multi-Number Input */}
                <div className="phone-input-custom">
                  {/* Country Selector (Input hidden via CSS) */}
                  <PhoneInput
                    defaultCountry="in"
                    value={formData.country || '+91'}
                    onChange={(phone, meta) => {
                      if (meta.country) {
                        setFormData(prev => ({
                          ...prev,
                          country: phone, // Keep track of phone value for selector
                          dialCode: meta.country.dialCode
                        }));
                      }
                    }}
                    inputStyle={{ display: 'none' }} // Hide the library's input
                    countrySelectorStyleProps={{
                      buttonClassName: 'country-selector-button'
                    }}
                  />

                  {/* Static Dial Code Display */}
                  <span className="text-gray-500 font-medium mr-2 select-none">
                    +{formData.dialCode || '91'}
                  </span>

                  {/* Custom Multi-Number Input */}
                  <input
                    type="text"
                    value={formData.rawNumbers || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers, commas, and spaces
                      if (/^[0-9, ]*$/.test(value)) {
                        setFormData(prev => ({ ...prev, rawNumbers: value }));
                      }
                    }}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
                    placeholder="9876543210, 9876543211"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Separate multiple numbers with commas</p>
              </div>

              {/* Settings Row */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
                  <label className="block text-xs font-bold text-[#008069] uppercase mb-2">
                    Message Count
                  </label>
                  <input
                    type="number"
                    name="totalMessages"
                    min="1"
                    required
                    className="w-full text-gray-700 outline-none border-b border-gray-200 focus:border-[#008069] py-1 transition-colors text-sm md:text-base"
                    value={formData.totalMessages}
                    onChange={handleChange}
                  />
                </div>
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
                  <label className="block text-xs font-bold text-[#008069] uppercase mb-2">
                    Delay (s)
                  </label>
                  <input
                    type="number"
                    name="delay"
                    min="0"
                    step="0.1"
                    required
                    className="w-full text-gray-700 outline-none border-b border-gray-200 focus:border-[#008069] py-1 transition-colors text-sm md:text-base"
                    value={formData.delay}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100 relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[#008069] uppercase">
                    Message
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-400 hover:text-[#008069] transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  name="message"
                  rows="3"
                  required
                  placeholder="Type a message"
                  className="w-full text-gray-700 placeholder-gray-400 outline-none resize-none text-sm md:text-base"
                  value={formData.message}
                  onChange={handleChange}
                />
                {showEmojiPicker && (
                  <>
                    {/* Backdrop (Mobile: Dark, Desktop: Transparent) - Handles click outside */}
                    <div
                      className="fixed inset-0 bg-black/20 md:bg-transparent z-40"
                      onClick={() => setShowEmojiPicker(false)}
                    />

                    {/* Picker Container */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] md:absolute md:top-auto md:bottom-full md:left-auto md:right-0 md:translate-x-0 md:translate-y-40 md:mb-2 shadow-2xl rounded-xl border border-gray-100">
                      <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                    </div>
                  </>
                )}
              </div>

              {/* Status Message (Toast) */}
              {status.message && (
                <div className={`absolute top-2 left-4 right-4 p-3 rounded-lg shadow-lg text-sm flex items-center justify-between gap-2 z-30 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{status.message}</span>
                  </div>
                  <button
                    onClick={() => setStatus({ type: '', message: '' })}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}

              {/* Submit/Cancel Button */}
              <div className="pt-2">
                {loading ? (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#008069] hover:bg-[#006d59] text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    Send Now
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
