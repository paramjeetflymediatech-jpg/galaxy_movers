'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Loader2, MapPin, Globe, Building } from 'lucide-react';

export default function LocationsManager({ initialStates, initialDistricts, initialLocations }) {
  const [activeTab, setActiveTab] = useState('states'); // 'states', 'districts', or 'locations'
  const [states, setStates] = useState(initialStates || []);
  const [districts, setDistricts] = useState(initialDistricts || []);
  const [locations, setLocations] = useState(initialLocations || []);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State Form fields
  const [isEditingState, setIsEditingState] = useState(false);
  const [stateId, setStateId] = useState(null);
  const [stateName, setStateName] = useState('');
  const [stateSlug, setStateSlug] = useState('');
  const [stateActive, setStateActive] = useState(true);

  // District Form fields
  const [isEditingDistrict, setIsEditingDistrict] = useState(false);
  const [districtId, setDistrictId] = useState(null);
  const [districtName, setDistrictName] = useState('');
  const [districtStateId, setDistrictStateId] = useState('');

  // Location (City) Form fields
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationId, setLocationId] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationSlug, setLocationSlug] = useState('');
  const [locationStateId, setLocationStateId] = useState('');
  const [locationDistrictId, setLocationDistrictId] = useState('');

  // Auto slugify helper for State
  const handleStateNameChange = (val) => {
    setStateName(val);
    if (!stateId) {
      setStateSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
      );
    }
  };

  // Auto slugify helper for Location/City
  const handleLocationNameChange = (val) => {
    setLocationName(val);
    if (!locationId) {
      setLocationSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
      );
    }
  };

  // Open/Close Handlers for State Form
  const handleOpenCreateState = () => {
    setStateId(null);
    setStateName('');
    setStateSlug('');
    setStateActive(true);
    setErrorMsg('');
    setIsEditingState(true);
  };

  const handleOpenEditState = (st) => {
    setStateId(st.id);
    setStateName(st.name);
    setStateSlug(st.slug);
    setStateActive(st.is_active);
    setErrorMsg('');
    setIsEditingState(true);
  };

  // Save State
  const handleSaveState = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const payload = {
      id: stateId,
      name: stateName,
      slug: stateSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      is_active: stateActive
    };

    try {
      const res = await fetch('/api/admin/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save province.');
      }

      if (stateId) {
        setStates(states.map((s) => (s.id === stateId ? data.state : s)));
      } else {
        setStates([...states, data.state].sort((a, b) => a.name.localeCompare(b.name)));
      }
      setIsEditingState(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete State
  const handleDeleteState = async (id) => {
    if (confirm('Are you absolutely sure you want to delete this province? All districts and cities linked to it will lose their state references. This action is permanent.')) {
      try {
        const res = await fetch(`/api/admin/states?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setStates(states.filter((s) => s.id !== id));
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete province.');
        }
      } catch (err) {
        console.error('Delete state error:', err);
      }
    }
  };

  // Open/Close Handlers for District Form
  const handleOpenCreateDistrict = () => {
    setDistrictId(null);
    setDistrictName('');
    setDistrictStateId(states[0]?.id || '');
    setErrorMsg('');
    setIsEditingDistrict(true);
  };

  const handleOpenEditDistrict = (dist) => {
    setDistrictId(dist.id);
    setDistrictName(dist.name);
    setDistrictStateId(dist.state_id || '');
    setErrorMsg('');
    setIsEditingDistrict(true);
  };

  // Save District
  const handleSaveDistrict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const payload = {
      id: districtId,
      name: districtName,
      state_id: Number(districtStateId)
    };

    try {
      const res = await fetch('/api/admin/districts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save district.');
      }

      // Fetch states again or resolve relation manually to update the view
      const selectedState = states.find(s => s.id === Number(districtStateId));
      const districtWithState = {
        ...data.district,
        State: selectedState ? { id: selectedState.id, name: selectedState.name, slug: selectedState.slug } : null
      };

      if (districtId) {
        setDistricts(districts.map((d) => (d.id === districtId ? districtWithState : d)));
      } else {
        setDistricts([...districts, districtWithState].sort((a, b) => a.name.localeCompare(b.name)));
      }
      setIsEditingDistrict(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete District
  const handleDeleteDistrict = async (id) => {
    if (confirm('Are you sure you want to delete this district? All cities linked to this region will lose their district references. This action is permanent.')) {
      try {
        const res = await fetch(`/api/admin/districts?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setDistricts(districts.filter((d) => d.id !== id));
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete district.');
        }
      } catch (err) {
        console.error('Delete district error:', err);
      }
    }
  };

  // Open/Close Handlers for Location (City) Form
  const handleOpenCreateLocation = () => {
    const defaultStateId = states[0]?.id || '';
    const filteredDists = districts.filter(d => d.state_id === Number(defaultStateId));

    setLocationId(null);
    setLocationName('');
    setLocationSlug('');
    setLocationStateId(defaultStateId);
    setLocationDistrictId(filteredDists[0]?.id || '');
    setErrorMsg('');
    setIsEditingLocation(true);
  };

  const handleOpenEditLocation = (loc) => {
    setLocationId(loc.id);
    setLocationName(loc.name);
    setLocationSlug(loc.slug);
    setLocationStateId(loc.state_id || '');
    setLocationDistrictId(loc.district_id || '');
    setErrorMsg('');
    setIsEditingLocation(true);
  };

  // Handle Location State dropdown change (filter district options)
  const handleLocationStateChange = (stId) => {
    setLocationStateId(stId);
    const filteredDists = districts.filter(d => d.state_id === Number(stId));
    setLocationDistrictId(filteredDists[0]?.id || '');
  };

  // Save Location (City)
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const payload = {
      id: locationId,
      name: locationName,
      slug: locationSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      state_id: Number(locationStateId),
      district_id: Number(locationDistrictId)
    };

    try {
      const res = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save location.');
      }

      // Resolve relations for updated local list view
      const selectedState = states.find(s => s.id === Number(locationStateId));
      const selectedDistrict = districts.find(d => d.id === Number(locationDistrictId));
      const locationWithRelations = {
        ...data.location,
        State: selectedState ? { id: selectedState.id, name: selectedState.name, slug: selectedState.slug } : null,
        District: selectedDistrict ? { id: selectedDistrict.id, name: selectedDistrict.name } : null
      };

      if (locationId) {
        setLocations(locations.map((l) => (l.id === locationId ? locationWithRelations : l)));
      } else {
        setLocations([...locations, locationWithRelations].sort((a, b) => a.name.localeCompare(b.name)));
      }
      setIsEditingLocation(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Location (City)
  const handleDeleteLocation = async (id) => {
    if (confirm('Are you absolutely sure you want to delete this city/location? All service links and page routes matching this city will be deleted. This action is permanent.')) {
      try {
        const res = await fetch(`/api/admin/locations?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setLocations(locations.filter((l) => l.id !== id));
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete city.');
        }
      } catch (err) {
        console.error('Delete location error:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-150">
        <button
          onClick={() => { setActiveTab('states'); setErrorMsg(''); }}
          className={`flex items-center space-x-2 py-3 px-6 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'states'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Provinces & States</span>
        </button>
        <button
          onClick={() => { setActiveTab('districts'); setErrorMsg(''); }}
          className={`flex items-center space-x-2 py-3 px-6 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'districts'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Districts & Regions</span>
        </button>
        <button
          onClick={() => { setActiveTab('locations'); setErrorMsg(''); }}
          className={`flex items-center space-x-2 py-3 px-6 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'locations'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Cities & Locations</span>
        </button>
      </div>

      {/* ------------------------------------- PROVINCES/STATES TAB ------------------------------------- */}
      {activeTab === 'states' && (
        <div className="space-y-6">
          {!isEditingState ? (
            <>
              {/* Action Bar */}
              <div className="flex justify-between items-center bg-white p-4 border border-gray-150 rounded-2xl shadow-sm">
                <span className="text-sm font-bold text-gray-500">
                  {states.length} Provinces Configured
                </span>
                <button
                  onClick={handleOpenCreateState}
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:shadow-red-600/15 flex items-center text-sm cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5 mr-1.5" />
                  <span>Add Province</span>
                </button>
              </div>

              {/* States List */}
              <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-100 text-left text-sm font-semibold">
                  <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">URL Slug</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {states.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-gray-400 font-medium">
                          No provinces configured. Add your first province/state!
                        </td>
                      </tr>
                    ) : (
                      states.map((st) => (
                        <tr key={st.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-extrabold text-gray-900">{st.name}</td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">/{st.slug}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              st.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {st.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-3.5">
                            <button
                              onClick={() => handleOpenEditState(st)}
                              type="button"
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteState(st.id)}
                              type="button"
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* STATE EDIT/CREATE FORM */
            <div className="bg-white border border-gray-150 rounded-2xl shadow-md p-6 md:p-8 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h2 className="font-extrabold text-lg text-gray-900">
                  {stateId ? 'Edit Province Details' : 'Configure New Province'}
                </h2>
                <button
                  onClick={() => setIsEditingState(false)}
                  type="button"
                  className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveState} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Province/State Name
                    </label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => handleStateNameChange(e.target.value)}
                      placeholder="e.g. Ontario"
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={stateSlug}
                      onChange={(e) => setStateSlug(e.target.value)}
                      placeholder="e.g. ontario"
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="stateActive"
                    checked={stateActive}
                    onChange={(e) => setStateActive(e.target.checked)}
                    className="h-4 w-4 rounded text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <label htmlFor="stateActive" className="text-sm font-bold text-gray-700 select-none cursor-pointer">
                    Enable province in Locations drop-down picker
                  </label>
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-end space-x-4 border-t border-gray-100 pt-6">
                  <button
                    onClick={() => setIsEditingState(false)}
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2.5 px-7 rounded-lg text-sm shadow-lg hover:shadow-red-600/15 flex items-center transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        <span>Save Province</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------- DISTRICTS/REGIONS TAB ------------------------------------- */}
      {activeTab === 'districts' && (
        <div className="space-y-6">
          {!isEditingDistrict ? (
            <>
              {/* Action Bar */}
              <div className="flex justify-between items-center bg-white p-4 border border-gray-150 rounded-2xl shadow-sm">
                <span className="text-sm font-bold text-gray-500">
                  {districts.length} Regions/Districts Configured
                </span>
                <button
                  onClick={handleOpenCreateDistrict}
                  disabled={states.length === 0}
                  type="button"
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:shadow-red-600/15 flex items-center text-sm cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5 mr-1.5" />
                  <span>Add Region</span>
                </button>
              </div>

              {/* Districts List */}
              <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-100 text-left text-sm font-semibold">
                  <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">District / Region Name</th>
                      <th className="px-6 py-4">Parent Province</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {districts.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-10 text-gray-400 font-medium">
                          No districts/regions configured. Add your first region!
                        </td>
                      </tr>
                    ) : (
                      districts.map((dist) => (
                        <tr key={dist.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-extrabold text-gray-900">{dist.name}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center space-x-1.5 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg text-xs font-semibold">
                              <Globe className="h-3 w-3 text-red-500" />
                              <span>{dist.State?.name || 'Unassigned'}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-3.5">
                            <button
                              onClick={() => handleOpenEditDistrict(dist)}
                              type="button"
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDistrict(dist.id)}
                              type="button"
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* DISTRICT EDIT/CREATE FORM */
            <div className="bg-white border border-gray-150 rounded-2xl shadow-md p-6 md:p-8 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h2 className="font-extrabold text-lg text-gray-900">
                  {districtId ? 'Edit Region Details' : 'Configure New Region/District'}
                </h2>
                <button
                  onClick={() => setIsEditingDistrict(false)}
                  type="button"
                  className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDistrict} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Region/District Name
                    </label>
                    <input
                      type="text"
                      required
                      value={districtName}
                      onChange={(e) => setDistrictName(e.target.value)}
                      placeholder="e.g. Greater Toronto Area"
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Parent Province/State
                    </label>
                    <select
                      required
                      value={districtStateId}
                      onChange={(e) => setDistrictStateId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    >
                      {states.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-end space-x-4 border-t border-gray-100 pt-6">
                  <button
                    onClick={() => setIsEditingDistrict(false)}
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2.5 px-7 rounded-lg text-sm shadow-lg hover:shadow-red-600/15 flex items-center transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        <span>Save Region</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------- CITIES/LOCATIONS TAB ------------------------------------- */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          {!isEditingLocation ? (
            <>
              {/* Action Bar */}
              <div className="flex justify-between items-center bg-white p-4 border border-gray-150 rounded-2xl shadow-sm">
                <span className="text-sm font-bold text-gray-500">
                  {locations.length} Cities / Catchment Areas Configured
                </span>
                <button
                  onClick={handleOpenCreateLocation}
                  disabled={states.length === 0 || districts.length === 0}
                  type="button"
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded-xl shadow-lg hover:shadow-red-600/15 flex items-center text-sm cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5 mr-1.5" />
                  <span>Add City</span>
                </button>
              </div>

              {/* Cities Table */}
              <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-100 text-left text-sm font-semibold">
                  <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">City Name</th>
                      <th className="px-6 py-4">URL Slug</th>
                      <th className="px-6 py-4">Region / District</th>
                      <th className="px-6 py-4">Province / State</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {locations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-gray-400 font-medium">
                          No cities/locations configured. Add your first city!
                        </td>
                      </tr>
                    ) : (
                      locations.map((loc) => (
                        <tr key={loc.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-extrabold text-gray-900">{loc.name}</td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">/{loc.slug}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center text-gray-600 bg-gray-55 px-2.5 py-1 rounded-lg text-xs font-semibold">
                              {loc.District?.name || 'Unassigned'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center space-x-1 text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                              <Globe className="h-3 w-3 text-red-500" />
                              <span>{loc.State?.name || 'Unassigned'}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-3.5">
                            <button
                              onClick={() => handleOpenEditLocation(loc)}
                              type="button"
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLocation(loc.id)}
                              type="button"
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* CITY EDIT/CREATE FORM */
            <div className="bg-white border border-gray-150 rounded-2xl shadow-md p-6 md:p-8 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h2 className="font-extrabold text-lg text-gray-900">
                  {locationId ? 'Edit City Details' : 'Configure New City/Location'}
                </h2>
                <button
                  onClick={() => setIsEditingLocation(false)}
                  type="button"
                  className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLocation} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      City Name
                    </label>
                    <input
                      type="text"
                      required
                      value={locationName}
                      onChange={(e) => handleLocationNameChange(e.target.value)}
                      placeholder="e.g. Toronto"
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={locationSlug}
                      onChange={(e) => setLocationSlug(e.target.value)}
                      placeholder="e.g. toronto"
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Province / State
                    </label>
                    <select
                      required
                      value={locationStateId}
                      onChange={(e) => handleLocationStateChange(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    >
                      {states.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Region / District
                    </label>
                    <select
                      required
                      value={locationDistrictId}
                      onChange={(e) => setLocationDistrictId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 focus:border-red-500 focus:bg-white text-sm py-2.5 px-4 rounded-lg focus:outline-none transition-all font-semibold text-gray-800"
                    >
                      {districts
                        .filter((d) => d.state_id === Number(locationStateId))
                        .map((dist) => (
                          <option key={dist.id} value={dist.id}>
                            {dist.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-end space-x-4 border-t border-gray-100 pt-6">
                  <button
                    onClick={() => setIsEditingLocation(false)}
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2.5 px-7 rounded-lg text-sm shadow-lg hover:shadow-red-600/15 flex items-center transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        <span>Save City</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
