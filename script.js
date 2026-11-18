// Form elements
const registrationForm = document.getElementById('registrationForm');
const membersContainer = document.getElementById('membersContainer');
const addMemberBtn = document.getElementById('addMemberBtn');
const teamSizeSelect = document.getElementById('teamSize');
const successMessage = document.getElementById('successMessage');
const resetFormBtn = document.getElementById('resetFormBtn');

let memberCount = 1;
const maxMembers = 4;

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    // Update member fields based on team size
    teamSizeSelect.addEventListener('change', handleTeamSizeChange);
    
    // Add member button
    addMemberBtn.addEventListener('click', addTeamMember);
    
    // Form submission
    registrationForm.addEventListener('submit', handleFormSubmit);
    
    // Reset form button
    resetFormBtn.addEventListener('click', resetForm);
    
    // Initialize with solo team size
    handleTeamSizeChange();
});

// Handle team size change
function handleTeamSizeChange() {
    const teamSize = teamSizeSelect.value;
    const currentMembers = membersContainer.children.length;
    
    // Remove all existing members except the first one
    while (membersContainer.children.length > 1) {
        membersContainer.removeChild(membersContainer.lastChild);
    }
    
    memberCount = 1;
    
    // Add members based on team size
    if (teamSize === 'duo') {
        addTeamMember();
    } else if (teamSize === 'squad') {
        addTeamMember();
        addTeamMember();
        addTeamMember();
    }
    
    // Update add member button visibility
    updateAddMemberButton();
}

// Add a new team member
function addTeamMember() {
    if (memberCount >= maxMembers) {
        alert('Maximum team size is 4 members (Squad).');
        return;
    }
    
    memberCount++;
    const memberNumber = memberCount;
    
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-entry';
    memberDiv.innerHTML = `
        <h3>Player ${memberNumber}</h3>
        <div class="form-row">
            <div class="form-group">
                <label for="player${memberNumber}Name">Full Name *</label>
                <input type="text" id="player${memberNumber}Name" name="player${memberNumber}Name" required placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label for="player${memberNumber}Email">Email *</label>
                <input type="email" id="player${memberNumber}Email" name="player${memberNumber}Email" required placeholder="Enter email">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="player${memberNumber}Phone">Phone Number *</label>
                <input type="tel" id="player${memberNumber}Phone" name="player${memberNumber}Phone" required placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label for="player${memberNumber}GameId">In-Game ID *</label>
                <input type="text" id="player${memberNumber}GameId" name="player${memberNumber}GameId" required placeholder="Enter in-game ID">
            </div>
        </div>
        <button type="button" class="remove-member" onclick="removeMember(this)">Remove Member</button>
    `;
    
    membersContainer.appendChild(memberDiv);
    updateAddMemberButton();
}

// Remove a team member
function removeMember(button) {
    const memberEntry = button.closest('.member-entry');
    memberEntry.remove();
    memberCount--;
    updateMemberNumbers();
    updateAddMemberButton();
}

// Update member numbers after removal
function updateMemberNumbers() {
    const members = membersContainer.querySelectorAll('.member-entry');
    members.forEach((member, index) => {
        if (index === 0) {
            member.querySelector('h3').textContent = 'Player 1 (Team Leader) *';
        } else {
            member.querySelector('h3').textContent = `Player ${index + 1}`;
        }
    });
}

// Update add member button visibility
function updateAddMemberButton() {
    const teamSize = teamSizeSelect.value;
    const currentMembers = membersContainer.children.length;
    
    if (teamSize === 'solo' || currentMembers >= maxMembers) {
        addMemberBtn.style.display = 'none';
    } else {
        addMemberBtn.style.display = 'block';
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!registrationForm.checkValidity()) {
        registrationForm.reportValidity();
        return;
    }
    
    // Get form data
    const formData = new FormData(registrationForm);
    const registrationData = {
        game: formData.get('game'),
        teamName: formData.get('teamName'),
        collegeName: formData.get('collegeName'),
        teamSize: formData.get('teamSize'),
        experience: formData.get('experience'),
        previousTournaments: formData.get('previousTournaments'),
        availability: formData.get('availability'),
        members: []
    };
    
    // Collect member data
    const memberEntries = membersContainer.querySelectorAll('.member-entry');
    memberEntries.forEach((entry, index) => {
        const memberNumber = index + 1;
        registrationData.members.push({
            name: formData.get(`player${memberNumber}Name`),
            email: formData.get(`player${memberNumber}Email`),
            phone: formData.get(`player${memberNumber}Phone`),
            gameId: formData.get(`player${memberNumber}GameId`),
            isLeader: index === 0
        });
    });
    
    // Log registration data (in a real application, this would be sent to a server)
    console.log('Registration Data:', registrationData);
    
    // Show success message
    showSuccessMessage();
    
    // In a real application, you would send this data to your backend:
    // fetch('/api/register', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(registrationData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     showSuccessMessage();
    // })
    // .catch(error => {
    //     alert('Registration failed. Please try again.');
    //     console.error('Error:', error);
    // });
}

// Show success message
function showSuccessMessage() {
    registrationForm.style.display = 'none';
    successMessage.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset form
function resetForm() {
    registrationForm.reset();
    registrationForm.style.display = 'block';
    successMessage.classList.add('hidden');
    
    // Reset members
    while (membersContainer.children.length > 1) {
        membersContainer.removeChild(membersContainer.lastChild);
    }
    memberCount = 1;
    handleTeamSizeChange();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make removeMember function globally available
window.removeMember = removeMember;
